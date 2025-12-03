(function() {
	const { addFilter } = wp.hooks;
	const { sprintf, __ } = wp.i18n;

	/**
	 * URL からファイル名（拡張子含む）を取得
	 */
	function getFileNameFromUrl(url) {
		if (typeof url !== 'string' || !url) {
			return '';
		}
		const parts = url.split('/');
		const fileName = parts[parts.length - 1];
		return fileName.split('?')[0];
	}

	/**
	 * URL から拡張子を取得（ピリオド含む）
	 */
	function getExtensionFromUrl(url) {
		if (typeof url !== 'string' || !url) {
			return '';
		}
		const parts = url.split('/');
		const fileName = parts[parts.length - 1];
		const fileNameWithoutQuery = fileName.split('?')[0];
		const dotIndex = fileNameWithoutQuery.lastIndexOf('.');
		if (dotIndex > 0 && dotIndex < fileNameWithoutQuery.length - 1) {
			return fileNameWithoutQuery.substring(dotIndex);
		}
		return '';
	}

	/**
	 * 18文字以上なら短縮（先頭6 + "..." + 末尾6 + 拡張子）
	 */
	function truncateFileName(fileName, ext) {
		if (!fileName) return '';
		if (!ext) {
			if (fileName.length <= 17) return fileName;
			return fileName.slice(0, 6) + '...' + fileName.slice(-6);
		}
		const nameWithoutExt = fileName.substring(0, fileName.length - ext.length);
		const totalLength = fileName.length;
		if (totalLength <= 17) {
			return fileName;
		}
		const start = nameWithoutExt.slice(0, 6);
		const end = nameWithoutExt.slice(-6);
		return start + '...' + end + ext;
	}

	/**
	 * attributes から表示名とタイプを安全に取得
	 */
	function buildLabel(attributes) {
		if (!attributes) {
			return { name: '', isAlt: false };
		}
		const alt = typeof attributes.alt === 'string' ? attributes.alt.trim() : '';
		if (alt) {
			return { name: alt, isAlt: true };
		}
		const url = typeof attributes.url === 'string' ? attributes.url : '';
		return { name: getFileNameFromUrl(url), isAlt: false };
	}

	/**
	 * ラベル生成（共通ロジック）
	 */
	function generateLabel(attributes) {
		const labelData = buildLabel(attributes);
		if (!labelData.name) {
			return '';
		}
		let displayText;
		if (labelData.isAlt) {
			displayText = labelData.name;
		} else {
			const url = (attributes && attributes.url) || '';
			const ext = getExtensionFromUrl(url);
			displayText = truncateFileName(labelData.name, ext);
		}
		return sprintf(__('Image %s', 'andw-imagenamelabel'), displayText);
	}

	/**
	 * blocks.registerBlockType フィルターで core/image の __experimentalLabel を差し替え
	 */
	addFilter(
		'blocks.registerBlockType',
		'andw-imagenamelabel/register-block-type',
		function(settings, name) {
			if (name !== 'core/image') {
				return settings;
			}

			const originalLabel = settings.__experimentalLabel;

			return {
				...settings,
				__experimentalLabel: function(attributes, context) {
					// list-view 以外では元のラベルを返す
					const contextName = typeof context === 'string' ? context : (context && context.context) || '';
					if (contextName !== 'list-view') {
						if (typeof originalLabel === 'function') {
							return originalLabel(attributes, context);
						}
						return settings.title || __('Image', 'andw-imagenamelabel');
					}

					// list-view ではカスタムラベルを生成
					const customLabel = generateLabel(attributes);
					if (customLabel) {
						return customLabel;
					}

					// フォールバック
					if (typeof originalLabel === 'function') {
						return originalLabel(attributes, context);
					}
					return settings.title || __('Image', 'andw-imagenamelabel');
				}
			};
		}
	);
})();
