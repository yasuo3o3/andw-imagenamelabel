(function() {
	const { addFilter } = wp.hooks;
	const { sprintf, __ } = wp.i18n;

	/**
	 * URL からファイル名（拡張子含む）を取得
	 * @param {string} url - 画像URL
	 * @return {string} ファイル名（拡張子含む）
	 */
	function getFileNameFromUrl(url) {
		if (typeof url !== 'string' || !url) {
			return '';
		}

		// URL から最後の / 以降を取得
		const parts = url.split('/');
		const fileName = parts[parts.length - 1];

		// クエリパラメータを除去して返す
		return fileName.split('?')[0];
	}

	/**
	 * URL から拡張子を取得（ピリオド含む）
	 * @param {string} url - 画像URL
	 * @return {string} 拡張子（ピリオド含む、例: ".jpg"）
	 */
	function getExtensionFromUrl(url) {
		if (typeof url !== 'string' || !url) {
			return '';
		}

		// URL から最後の / 以降を取得
		const parts = url.split('/');
		const fileName = parts[parts.length - 1];

		// クエリパラメータを除去
		const fileNameWithoutQuery = fileName.split('?')[0];

		// 最後の . 以降を取得（ピリオド含む）
		const dotIndex = fileNameWithoutQuery.lastIndexOf('.');
		if (dotIndex > 0 && dotIndex < fileNameWithoutQuery.length - 1) {
			return fileNameWithoutQuery.substring(dotIndex);
		}

		return '';
	}

	/**
	 * 18文字以上なら短縮（先頭6 + "..." + 末尾6 + 拡張子）
	 * @param {string} fileName - ファイル名（拡張子含む）
	 * @param {string} ext - 拡張子（ピリオド含む）
	 * @return {string} 短縮後のファイル名
	 */
	function truncateFileName(fileName, ext) {
		if (!fileName) return '';

		// 拡張子がない場合は単純な短縮
		if (!ext) {
			if (fileName.length <= 17) return fileName;
			return fileName.slice(0, 6) + '...' + fileName.slice(-6);
		}

		// 拡張子を除いた部分の長さをチェック
		const nameWithoutExt = fileName.substring(0, fileName.length - ext.length);
		const totalLength = fileName.length;

		// 18文字以上なら短縮（拡張子は必ず残す）
		if (totalLength <= 17) {
			return fileName;
		}

		// 先頭6文字 + "..." + 末尾6文字（拡張子除く） + 拡張子
		const start = nameWithoutExt.slice(0, 6);
		const end = nameWithoutExt.slice(-6);
		return start + '...' + end + ext;
	}

	/**
	 * attributes から表示名を安全に取得
	 * @param {Object} attributes - ブロック属性
	 * @return {string} 表示名（alt または ファイル名（拡張子含む））
	 */
	function buildLabel(attributes) {
		if (!attributes) {
			return '';
		}

		// alt があれば alt を使用
		const alt = typeof attributes.alt === 'string' ? attributes.alt.trim() : '';
		if (alt) {
			return alt;
		}

		// alt が空なら URL からファイル名取得（拡張子含む）
		const url = typeof attributes.url === 'string' ? attributes.url : '';
		return getFileNameFromUrl(url);
	}

	/**
	 * ラベル生成（共通ロジック）
	 * @param {Object} attributes - ブロック属性
	 * @return {string} 生成されたラベル（空の場合は空文字列）
	 */
	function generateLabel(attributes) {
		const displayName = buildLabel(attributes);

		if (!displayName) {
			return '';
		}

		// 拡張子を取得（ピリオド含む）
		const url = (attributes && attributes.url) || '';
		const ext = getExtensionFromUrl(url);

		// 18文字以上なら短縮（拡張子は必ず残す）
		const truncated = truncateFileName(displayName, ext);

		// 「画像 ファイル名.拡張子」形式で返す
		// translators: %s はファイル名（拡張子含む）
		const finalLabel = sprintf(__('画像 %s', 'andw-imagenamelabel'), truncated);

		return finalLabel;
	}

	/**
	 * blocks.getBlockLabel フィルター
	 * 注意: WordPress 6.3+ では List View で機能しないため、
	 * __experimentalLabel も併用する必要があります
	 */
	addFilter(
		'blocks.getBlockLabel',
		'andw-imagenamelabel/get-block-label',
		function(label, blockType, attributes) {
			if (!blockType || blockType.name !== 'core/image') {
				return label;
			}

			const customLabel = generateLabel(attributes);
			return customLabel || label;
		}
	);

	/**
	 * blocks.registerBlockType フィルター
	 * 注意: __experimentalLabel は実験的 API ですが、WordPress 6.3+ の List View では
	 * これが唯一の方法です。WordPress コアが安定 API を提供するまでの暫定対応です。
	 */
	if (typeof wp !== 'undefined' && wp.hooks) {
		addFilter(
			'blocks.registerBlockType',
			'andw-imagenamelabel/add-label',
			function(settings, name) {
				if (name !== 'core/image') {
					return settings;
				}

				const originalLabel = settings.__experimentalLabel;

				return Object.assign({}, settings, {
					__experimentalLabel: function(attributes, context) {
						// context 形式の汎用判定
						const contextName =
							typeof context === 'string'
								? context
								: (context && (context.context || context.name)) || '';

						if (contextName !== 'list-view') {
							return originalLabel
								? originalLabel(attributes, context)
								: settings.title || 'Image';
						}

						const label = generateLabel(attributes);
						if (!label) {
							return originalLabel
								? originalLabel(attributes, context)
								: settings.title || 'Image';
						}

						return label;
					}
				});
			}
		);
	}
})();
