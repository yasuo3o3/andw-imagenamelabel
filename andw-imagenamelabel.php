<?php
/**
 * Plugin Name: andW ImageNameLabel
 * Plugin URI: https://github.com/yasuo3o3/andw-imagenamelabel
 * Description: ブロックエディタのリストビューで core/image ブロックのラベルを画像名で差し替える
 * Version: 1.1.0
 * Author: yasuo3o3
 * Author URI: https://yasuo-o.xyz/
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: andw-imagenamelabel
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * エディタ用アセット（JS）をエンキュー
 */
function andw_imagenamelabel_enqueue_editor_assets() {
	// エディタ用JS
	wp_enqueue_script(
		'andw-imagenamelabel-editor',
		plugin_dir_url( __FILE__ ) . 'assets/editor.js',
		array( 'wp-blocks', 'wp-hooks', 'wp-i18n' ),
		'1.1.0',
		true
	);

	// エディタ用CSS
	wp_enqueue_style(
		'andw-imagenamelabel-editor',
		plugin_dir_url( __FILE__ ) . 'assets/editor.css',
		array(),
		'1.1.0'
	);

	// スクリプトの翻訳設定
	wp_set_script_translations(
		'andw-imagenamelabel-editor',
		'andw-imagenamelabel',
		plugin_dir_path( __FILE__ ) . 'languages'
	);
}
add_action( 'enqueue_block_editor_assets', 'andw_imagenamelabel_enqueue_editor_assets' );
