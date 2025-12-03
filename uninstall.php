<?php
/**
 * Uninstall andW ImageNameLabel
 *
 * このプラグインはデータベースやオプションに何も保存しないため、
 * アンインストール時の処理は不要です。
 *
 * This plugin does not store any data in the database or options,
 * so no cleanup is required during uninstallation.
 *
 * @package andW_ImageNameLabel
 * @since 1.0.8
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// このプラグインはクリーンアップ不要（データ保存なし）
// No cleanup required (no data stored)
