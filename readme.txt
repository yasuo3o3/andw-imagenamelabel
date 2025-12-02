=== andW ImageNameLabel ===
Contributors: yasuo3o3
Tags: block editor, image, list view, gutenberg
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 0.0.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

ブロックエディタのリストビューで core/image ブロックのラベルを画像名で差し替える。

== Description ==

ブロックエディタのリストビューにおいて、core/image ブロックのラベルを画像の alt テキストまたはファイル名で差し替えます。

**主な機能:**

* alt テキストが設定されている場合は alt を表示
* alt が空の場合は URL からファイル名（拡張子除く）を取得して表示
* 13文字以上のファイル名は自動で短縮（先頭6文字 + "..." + 末尾6文字）
* 表示形式: 「画像 <ファイル名> [ 拡張子 ]」（拡張子の前後にスペース）

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

すべての画像形式に対応しています。拡張子は大文字で「画像 <ファイル名> [ PNG ]」のように表示されます。

== Changelog ==

= 0.0.5 =
* getFileNameFromUrl 関数のバグ修正（ファイル名が空になる問題を解決）
* lastIndexOf と substring を使用した確実なファイル名抽出に変更

= 0.0.4 =
* ラベル表示フォーマットを「画像 <ファイル名> [ 拡張子 ]」に変更
* ファイル名短縮を前後6文字に拡大（前後4文字から変更）
* 拡張子表示の前後にスペースを追加
* 「画像」という文字をラベルに含めるように変更

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
