(function() {
	const { addFilter } = wp.hooks;

	/**
	 * URL からファイル名（拡張子除く）を取得
	 * @param {string} url - 画像URL
	 * @return {string} ファイル名（拡張子除く）
	 */
	function getFileNameFromUrl(url) {
		if (typeof url !== 'string' || !url) {
			return '';
		}

		// URL から最後の / 以降を取得
		const parts = url.split('/');
		const fileName = parts[parts.length - 1];

		// クエリパラメータを除去
		const fileNameWithoutQuery = fileName.split('?')[0];

		// 拡張子を除去
		const dotIndex = fileNameWithoutQuery.lastIndexOf('.');
		if (dotIndex > 0) {
			return fileNameWithoutQuery.substring(0, dotIndex);
		}

		// 拡張子がない場合はそのまま返す
		return fileNameWithoutQuery;
	}

	/**
	 * URL から拡張子を取得
	 * @param {string} url - 画像URL
	 * @return {string} 拡張子（小文字、ピリオドなし）
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

		// 最後の . 以降を取得
		const dotIndex = fileNameWithoutQuery.lastIndexOf('.');
		if (dotIndex > 0 && dotIndex < fileNameWithoutQuery.length - 1) {
			return fileNameWithoutQuery.substring(dotIndex + 1).toLowerCase();
		}

		return '';
	}

	/**
	 * 13文字以上なら短縮（先頭6 + "..." + 末尾6）
	 * @param {string} str - 対象文字列
	 * @return {string} 短縮後の文字列
	 */
	function truncateFileName(str) {
		if (!str || str.length <= 12) return str;
		return str.slice(0, 6) + '...' + str.slice(-6);
	}

	/**
	 * attributes から表示名を安全に取得
	 * @param {Object} attributes - ブロック属性
	 * @return {string} 表示名（alt または ファイル名）
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

		// alt が空なら URL からファイル名取得
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

		// 13文字以上なら短縮
		const truncated = truncateFileName(displayName);

		// 拡張子を取得
		const url = (attributes && attributes.url) || '';
		const ext = getExtensionFromUrl(url);

		// 「画像 <名前> [ 拡張子 ]」形式で返す
		if (ext) {
			return '画像 <' + truncated + '> [ ' + ext.toUpperCase() + ' ]';
		}
		return '画像 <' + truncated + '>';
	}

	/**
	 * 1. blocks.registerBlockType フィルター（WP 6.3+ で動作）
	 */
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
					// WP 6.0-6.3: { context: 'list-view' }（オブジェクト）
					// WP 6.4-6.7: 'list-view'（文字列の場合もある）
					// 古い Gutenberg: { name: 'list-view' }
					const contextName =
						typeof context === 'string'
							? context
							: (context && (context.context || context.name)) || '';

					if (contextName !== 'list-view') {
						// list-view 以外のコンテキストでは元のラベルを返す
						return originalLabel
							? originalLabel(attributes, context)
							: settings.title || 'Image';
					}

					// カスタムラベル生成
					const label = generateLabel(attributes);
					if (!label) {
						// ラベルが生成できない場合は元のラベルを返す
						return originalLabel
							? originalLabel(attributes, context)
							: settings.title || 'Image';
					}

					return label;
				}
			});
		}
	);

	/**
	 * 2. blocks.getBlockLabel フィルター（WP 6.0-6.2 互換性）
	 */
	addFilter(
		'blocks.getBlockLabel',
		'andw-imagenamelabel/get-block-label',
		function(label, blockType, attributes) {
			if (!blockType || blockType.name !== 'core/image') {
				return label;
			}

			// カスタムラベル生成
			const customLabel = generateLabel(attributes);
			return customLabel || label;
		}
	);
})();
