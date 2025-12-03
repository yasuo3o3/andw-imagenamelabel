(function() {
	const { addFilter } = wp.hooks;
	const { sprintf, __ } = wp.i18n;
	const { createElement } = wp.element;

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
	 * attributes から表示名とタイプを安全に取得
	 * @param {Object} attributes - ブロック属性
	 * @return {Object} { name: 表示名, isAlt: alt かどうか }
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
		const url = typeof attributes.url === 'string' ? attributes.url : '';
		return { name: getFileNameFromUrl(url), isAlt: false };
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
			// ファイル名の場合は拡張子を取得して短縮処理
			const url = (attributes && attributes.url) || '';
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

	/**
	 * editor.BlockNavigationBlock フィルター
	 * WordPress 6.3+ の List View 専用
	 * props.block.attributes から直接ラベルを生成して block を書き換える
	 */
	addFilter(
		'editor.BlockNavigationBlock',
		'andw-imagenamelabel/list-view-label',
		function(BlockNavigationBlock) {
			return function(props) {
				// core/image 以外はそのまま返す
				if (props.block?.name !== 'core/image') {
					return createElement(BlockNavigationBlock, props);
				}

				// props.block.attributes から直接ラベルを生成
				const customLabel = generateLabel(props.block.attributes || {});

				// ラベルが生成できない場合はデフォルト
				if (!customLabel) {
					return createElement(BlockNavigationBlock, props);
				}

				// 重要: props.title ではなく props.block を書き換える
				// BlockNavigationBlock は内部で props.block からラベルを計算する
				const modifiedBlock = {
					...props.block,
					// カスタムラベルを block のメタ情報として注入
					attributes: {
						...props.block.attributes,
						// WordPress が認識する形でラベル情報を追加
						// alt が空の場合はカスタムラベルを alt として注入
						alt: props.block.attributes?.alt || customLabel
					}
				};

				// 書き換えた block で BlockNavigationBlock をレンダリング
				return createElement(BlockNavigationBlock, {
					...props,
					block: modifiedBlock
				});
			};
		}
	);
})();
