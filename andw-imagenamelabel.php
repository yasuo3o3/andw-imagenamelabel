<?php
/**
 * Plugin Name: andW ImageNameLabel
 * Description: ブロックエディタのリストビューで core/image ブロックのラベルを画像名で差し替える
 * Version: 1.0.3
 * Author: yasuo3o3
 * Author URI: https://yasuo-o.xyz/
 * License: GPLv2 or later
 * Text Domain: andw-imagenamelabel
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
		array( 'wp-blocks', 'wp-hooks' ),
		'1.0.3',
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'andw_imagenamelabel_enqueue_editor_assets' );
