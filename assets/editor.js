(function() {
	const { addFilter } = wp.hooks;

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
	 * core/image ブロックに __experimentalLabel を追加
	 */
	addFilter(
		'blocks.registerBlockType',
		'andw-imagenamelabel/add-label',
		function(settings, name) {
			if (name !== 'core/image') {
				return settings;
			}

			return Object.assign({}, settings, {
				__experimentalLabel: function(attributes, context) {
					// list-view コンテキストの場合のみカスタムラベルを返す
					if (context && context.context === 'list-view') {
						let displayName = '';
						let ext = '';

						// 1. alt があれば alt を使用
						if (attributes.alt && typeof attributes.alt === 'string' && attributes.alt.trim() !== '') {
							displayName = attributes.alt.trim();
							if (attributes.url) {
								ext = getExtensionFromUrl(attributes.url);
							}
						}
						// 2. alt が空なら URL からファイル名取得
						else if (attributes.url && typeof attributes.url === 'string') {
							displayName = getFileNameFromUrl(attributes.url);
							ext = getExtensionFromUrl(attributes.url);
						}

						// ファイル名が取得できない場合はデフォルトラベルを返す
						if (!displayName) {
							return settings.title || 'Image';
						}

						// 3. 9文字以上なら短縮
						displayName = truncateFileName(displayName);

						// 4. 拡張子を含めた文字列を返す
						// ※ list-view では HTML要素ではなく文字列を返す必要がある
						if (ext) {
							return displayName + ' [' + ext.toUpperCase() + ']';
						}
						return displayName;
					}

					// その他のコンテキストではデフォルトのタイトルを返す
					return settings.title || 'Image';
				}
			});
		}
	);
})();
