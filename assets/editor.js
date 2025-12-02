(function() {
	const { addFilter } = wp.hooks;
	const { createElement } = wp.element;

	/**
	 * URL からファイル名（拡張子除く）を取得
	 * @param {string} url - 画像URL
	 * @return {string} ファイル名（拡張子除く）
	 */
	function getFileNameFromUrl(url) {
		if (!url || typeof url !== 'string') return '';
		const parts = url.split('/');
		const fileName = parts[parts.length - 1];
		const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
		return nameWithoutExt || fileName;
	}

	/**
	 * URL から拡張子を取得
	 * @param {string} url - 画像URL
	 * @return {string} 拡張子（小文字、ピリオドなし）
	 */
	function getExtensionFromUrl(url) {
		if (!url || typeof url !== 'string') return '';
		const parts = url.split('.');
		if (parts.length < 2) return '';
		const ext = parts[parts.length - 1].toLowerCase();
		// クエリパラメータを除去
		return ext.split('?')[0];
	}

	/**
	 * 9文字以上なら短縮（先頭4 + "..." + 末尾4）
	 * @param {string} str - 対象文字列
	 * @return {string} 短縮後の文字列
	 */
	function truncateFileName(str) {
		if (!str || str.length <= 8) return str;
		return str.slice(0, 4) + '...' + str.slice(-4);
	}

	/**
	 * 拡張子に応じた CSS クラスを返す
	 * @param {string} ext - 拡張子
	 * @return {string} CSS クラス名
	 */
	function getMimeClass(ext) {
		if (ext === 'png') return 'andw-mime-png';
		if (ext === 'jpg' || ext === 'jpeg') return 'andw-mime-jpg';
		return 'andw-mime-other';
	}

	/**
	 * BlockListBlock のラベルをフックして差し替え
	 */
	addFilter(
		'blocks.getBlockLabel',
		'andw-imagenamelabel/custom-label',
		function(label, blockType, attributes) {
			// core/image 以外はスルー
			if (!blockType || blockType.name !== 'core/image') {
				return label;
			}

			// 属性存在確認
			if (!attributes) {
				return label;
			}

			let displayName = '';
			let ext = '';

			// 1. alt があれば alt を使用
			if (attributes.alt && typeof attributes.alt === 'string' && attributes.alt.trim() !== '') {
				displayName = attributes.alt.trim();
				// alt の場合も拡張子取得は URL から
				if (attributes.url) {
					ext = getExtensionFromUrl(attributes.url);
				}
			}
			// 2. alt が空なら URL からファイル名取得
			else if (attributes.url && typeof attributes.url === 'string') {
				displayName = getFileNameFromUrl(attributes.url);
				ext = getExtensionFromUrl(attributes.url);
			}

			// ファイル名が取得できない場合は元のラベルを返す
			if (!displayName) {
				return label;
			}

			// 3. 9文字以上なら短縮
			displayName = truncateFileName(displayName);

			// 4. span 要素を生成
			const className = 'andw-image-name-label ' + getMimeClass(ext);

			return createElement(
				'span',
				{
					className: className
				},
				displayName
			);
		}
	);
})();
