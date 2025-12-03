(function() {
	const { addFilter } = wp.hooks;
	const { sprintf, __ } = wp.i18n;
	const data = wp.data;

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
	 * ブロック属性から URL を解決
	 * @param {Object} attributes - ブロック属性
	 * @return {string} URL
	 */
	function resolveUrl(attributes) {
		if (attributes && typeof attributes.url === 'string' && attributes.url) {
			return attributes.url;
		}

		if (
			!attributes ||
			typeof attributes.id !== 'number' ||
			!wp ||
			!data ||
			typeof data.select !== 'function'
		) {
			return '';
		}

		const media = data.select('core')?.getMedia(attributes.id);
		return media?.source_url || '';
	}

	/**
	 * attributes から表示名とタイプを安全に取得
	 * @param {Object} attributes - ブロック属性
	 * @return {Object} { name: 表示名, isAlt: alt かどうか, url?: 取得元 URL }
	 */
	function buildLabel(attributes) {
		if (!attributes) {
			return { name: '', isAlt: false };
		}

		// alt があれば alt を使用（短縮・拡張子付与なし）
		const alt = typeof attributes.alt === 'string' ? attributes.alt.trim() : '';
		if (alt) {
			return { name: alt, isAlt: true };
		}

		// alt が空なら URL からファイル名取得（拡張子含む）
		const url = resolveUrl(attributes);
		return { name: getFileNameFromUrl(url), isAlt: false, url };
	}

	/**
	 * ラベル生成（共通ロジック）
	 * @param {Object} attributes - ブロック属性
	 * @return {string} 生成されたラベル（空の場合は空文字列）
	 */
	function generateLabel(attributes) {
		const labelData = buildLabel(attributes);

		if (!labelData.name) {
			return '';
		}

		let displayText;

		if (labelData.isAlt) {
			// alt の場合は短縮も拡張子付与もしない
			displayText = labelData.name;
		} else {
			// ファイル名の場合は URL を解決して拡張子を取得し短縮
			const url = labelData.url || resolveUrl(attributes);
			const ext = getExtensionFromUrl(url);

			// 18文字以上なら短縮（拡張子は必ず残す）
			displayText = truncateFileName(labelData.name, ext);
		}

		// 「画像 表示名」形式で返す
		// translators: %s はファイル名（拡張子含む）または alt テキスト
		const finalLabel = sprintf(__('画像 %s', 'andw-imagenamelabel'), displayText);

		return finalLabel;
	}

	/**
	 * blocks.getBlockLabel フィルター
	 * WordPress 6.0+ で使用可能な安定 API
	 * すべてのコンテキスト（List View、インスペクター、置換ダイアログ等）で使用
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

	// List View も含めて blocks.getBlockLabel の結果を使用するため追加フックは不要
})();
