=== andW ImageNameLabel ===
Contributors: yasuo3o3
Tags: block editor, image, list view, gutenberg
Requires at least: 6.0
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.8
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Displays image filenames or alt text in the block editor's List View for core/image blocks.

== Description ==

This plugin replaces the label of core/image blocks in the block editor's List View with the image's alt text or filename.

**Key Features:**

* Displays alt text if available
* Shows filename (including extension) from URL when alt is empty
* Automatically truncates long filenames (18+ characters): first 6 + "..." + last 6 + extension
* Display format: "Image filename.ext" (plain text only)

**Characteristics:**

* Lightweight implementation without build process (PHP + vanilla JavaScript)
* Works only in editor (no frontend impact)
* Follows WordPress Coding Standards

---

**日本語説明**

ブロックエディタのリストビューにおいて、core/image ブロックのラベルを画像の alt テキストまたはファイル名で差し替えます。

**主な機能:**

* alt テキストが設定されている場合は alt を表示
* alt が空の場合は URL からファイル名（拡張子含む）を取得して表示
* 18文字以上のファイル名は自動で短縮（先頭6文字 + "..." + 末尾6文字 + 拡張子）
* 表示形式: 「画像 ファイル名.拡張子」（プレーンテキストのみ）

**特徴:**

* ビルド不要の軽量実装（PHP + 素の JavaScript）
* エディタ画面のみで動作（フロントエンドには影響なし）
* WordPress コーディング規約準拠

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/andw-imagenamelabel/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Open the List View in the block editor and confirm that image block labels have changed

**日本語:**

1. プラグインファイルを `/wp-content/plugins/andw-imagenamelabel/` ディレクトリにアップロード
2. WordPress の「プラグイン」メニューからプラグインを有効化
3. ブロックエディタでリストビューを開き、画像ブロックのラベルが変更されていることを確認

== Frequently Asked Questions ==

= Does this affect the frontend? =

No, this plugin only works in the editor and has no impact on the frontend.

= What image formats are supported? =

All image formats are supported. The entire filename including extension is displayed like "Image mongol-cow.png".

---

**日本語 FAQ**

= フロントエンドに影響はありますか？ =

いいえ、このプラグインはエディタ画面のみで動作し、フロントエンドには一切影響しません。

= 対応している画像形式は？ =

すべての画像形式に対応しています。拡張子を含めたファイル名全体が「画像 mongol-cow.png」のように表示されます。

== Changelog ==

= 1.0.8 =
* [Major] editor.BlockNavigationBlock フィルターを追加（WordPress 6.3+ の List View 対応）
* [Major] WordPress.org 規約に準拠しつつ全バージョン（6.0-6.9）対応を実現
* [Info] wp-element を依存関係に追加
* [Info] 公開 API のみ使用（__experimentalLabel 不使用）

= 1.0.7 =
* [Major] __experimentalLabel の使用を削除（WordPress.org 規約準拠）
* [Major] blocks.getBlockLabel のみを使用する安定 API 実装に変更
* [Major] alt テキストの短縮・拡張子付与問題を修正（alt はそのまま表示）
* [Minor] languages フォルダと翻訳ファイル（POT, PO, JSON）を追加
* [Info] WordPress 6.3+ の List View で動作しない可能性あり（安定 API 使用のため）

= 1.0.6 =
* [Major] 国際化対応: wp.i18n の翻訳関数を使用
* [Major] wp_set_script_translations を追加して JavaScript の翻訳をサポート
* [Major] wp-i18n を依存関係に追加
* [Minor] デバッグログ（console.log）を削除
* [Minor] 未使用の editor.css を削除
* [Info] __experimentalLabel の使用について説明を追加（WordPress 6.3+ の List View では必須）

= 1.0.5 =
* 拡張子を含めたファイル名全体を表示するように変更（括弧付き拡張子を削除）
* 短縮ルールを変更: 18文字以上の場合に前後6文字 + 拡張子
* 表示形式を「画像 ファイル名.拡張子」に変更

= 1.0.4 =
* WordPress 6.5+ の stripHTML() によるファイル名消失問題を修正
* 山括弧 < > を削除してプレーンテキストのみに変更（表示形式: 「画像 ファイル名 [拡張子]」）
* デバッグログを追加（調査用）

= 1.0.3 =
* デバッグログを追加（調査用）

= 1.0.2 =
* attributes が undefined のケースに対応（メディア未選択時やLazy Load中のエラーを修正）
* context 形式の判定を汎用化（文字列/オブジェクト両対応、WordPress 6.0-6.7 全バージョンで動作）
* blocks.getBlockLabel フィルターを追加（WordPress 6.0-6.2 互換性向上）
* buildLabel / generateLabel 関数を追加してコード構造を改善

= 1.0.1 =
* デバッグログを追加（問題調査用）

= 1.0.0 =
* 初回安定版リリース
* デバッグログを削除
* 動作確認完了

= 0.0.6 =
* getExtensionFromUrl 関数も修正（URL全体ではなくファイル名から拡張子を抽出）
* デバッグ用コンソールログを追加

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
