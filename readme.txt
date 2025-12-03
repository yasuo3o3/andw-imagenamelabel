=== andW ImageNameLabel ===
Contributors: yasuo3o3
Tags: block editor, image, list view, gutenberg
Requires at least: 6.0
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

ブロックエディタのリストビューで core/image ブロックのラベルを画像名で差し替える。

== Description ==

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

1. プラグインファイルを `/wp-content/plugins/andw-imagenamelabel/` ディレクトリにアップロード
2. WordPress の「プラグイン」メニューからプラグインを有効化
3. ブロックエディタでリストビューを開き、画像ブロックのラベルが変更されていることを確認

== Frequently Asked Questions ==

= フロントエンドに影響はありますか？ =

いいえ、このプラグインはエディタ画面のみで動作し、フロントエンドには一切影響しません。

= 対応している画像形式は？ =

すべての画像形式に対応しています。拡張子を含めたファイル名全体が「画像 mongol-cow.png」のように表示されます。

== Changelog ==

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
