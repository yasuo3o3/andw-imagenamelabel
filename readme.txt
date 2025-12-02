=== andW ImageNameLabel ===
Contributors: yasuo3o3
Tags: block editor, image, list view, gutenberg
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 0.0.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

ブロックエディタのリストビューで core/image ブロックのラベルを画像名で差し替える。

== Description ==

ブロックエディタのリストビューにおいて、core/image ブロックのラベルを画像の alt テキストまたはファイル名で差し替えます。

**主な機能:**

* alt テキストが設定されている場合は alt を表示
* alt が空の場合は URL からファイル名（拡張子除く）を取得して表示
* 9文字以上のファイル名は自動で短縮（先頭4文字 + "..." + 末尾4文字）
* 拡張子を大文字で表示（例: [PNG], [JPG]）

**特徴:**

* ビルド不要の軽量実装（PHP + 素の JavaScript）
* エディタ画面のみで動作（フロントエンドには影響なし）
* WordPress コーディング規約準拠

== Installation ==

1. プラグインファイルを `/wp-content/plugins/andw-imagenamelabel/` ディレクトリにアップロード
2. WordPress の「プラグイン」メニューからプラグインを有効化
3. ブロックエディタでリストビューを開き、画像ブロックのラベルが変更されていることを確認

== Frequently Asked Questions ==

= フロントエンドに影響はありますか？ =

いいえ、このプラグインはエディタ画面のみで動作し、フロントエンドには一切影響しません。

= 対応している画像形式は？ =

すべての画像形式に対応しています。拡張子は大文字で [PNG], [JPG] のように表示されます。

== Changelog ==

= 0.0.3 =
* __experimentalLabel を使用した正しい実装に変更
* blocks.registerBlockType フィルターで core/image に __experimentalLabel を追加
* CSSエンキューを削除（リストビューでは文字列のみ表示）
* 拡張子を [PNG], [JPG] 形式で表示

= 0.0.2 =
* フィルターを editor.BlockListBlock に修正（blocks.getBlockLabel は無関係だった）
* wp-block-editor 依存を追加
* リストビューでのラベル差し替えが正しく動作するように修正

= 0.0.1 =
* 初回リリース
* リストビューで core/image ブロックのラベルを画像名で差し替え機能を実装
