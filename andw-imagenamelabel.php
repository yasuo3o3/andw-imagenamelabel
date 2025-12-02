<?php
/**
 * Plugin Name: andW ImageNameLabel
 * Description: ブロックエディタのリストビューで core/image ブロックのラベルを画像名で差し替える
 * Version: 0.0.1
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
 * エディタ用アセット（JS/CSS）をエンキュー
 */
function andw_imagenamelabel_enqueue_editor_assets() {
	// エディタ用JS
	wp_enqueue_script(
		'andw-imagenamelabel-editor',
		plugin_dir_url( __FILE__ ) . 'assets/editor.js',
		array( 'wp-blocks', 'wp-element', 'wp-hooks', 'wp-components' ),
		'0.0.1',
		true
	);

	// エディタ用CSS
	wp_enqueue_style(
		'andw-imagenamelabel-editor',
		plugin_dir_url( __FILE__ ) . 'assets/editor.css',
		array(),
		'0.0.1'
	);
}
add_action( 'enqueue_block_editor_assets', 'andw_imagenamelabel_enqueue_editor_assets' );
