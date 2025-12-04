# andW ImageNameLabel

WordPress ブロックエディタのリストビューで、画像ブロックのラベルを画像ファイル名で差し替えるプラグインです。

## 概要

ブロックエディタのリストビューにおいて、`core/image` ブロックのラベルを画像の alt テキストまたはファイル名で差し替えます。複数の画像を扱う際に、リストビューで画像を識別しやすくなります。

## 主な機能

- **alt テキスト優先表示**: alt テキストが設定されている場合は alt を表示
- **ファイル名表示**: alt が空の場合は URL からファイル名（拡張子含む）を取得して表示
- **自動短縮**: 18文字以上のファイル名は自動で短縮（先頭6文字 + "..." + 末尾6文字 + 拡張子）
- **表示形式**: 「画像 ファイル名.拡張子」（プレーンテキストのみ）

### 表示例

- **通常**: `画像 mongol-cow.png`
- **alt 設定時**: `画像 モンゴルの牛`
- **長いファイル名**: `画像 very-l...e-name.jpg`（18文字以上の場合）

## 特徴

- **ビルド不要**: PHP + 素の JavaScript による軽量実装
- **エディタ専用**: エディタ画面のみで動作（フロントエンドには影響なし）
- **幅広い互換性**: WordPress 6.0 〜 6.9 で動作確認済み
- **WordPress コーディング規約準拠**

## 動作要件

- **WordPress**: 6.0 以上
- **PHP**: 7.4 以上
- **テスト済み**: WordPress 6.9

## インストール

### WordPress.org から（準備中）

1. WordPress 管理画面の「プラグイン」→「新規追加」
2. 「andW ImageNameLabel」で検索
3. 「今すぐインストール」→「有効化」

### 手動インストール

1. このリポジトリをダウンロードまたはクローン
2. `andw-imagenamelabel` フォルダを `/wp-content/plugins/` ディレクトリにアップロード
3. WordPress の「プラグイン」メニューからプラグインを有効化
4. ブロックエディタでリストビューを開き、画像ブロックのラベルが変更されていることを確認

```bash
cd /wp-content/plugins/
git clone https://github.com/yasuo3o3/andw-imagenamelabel.git
```

## 使い方

1. WordPress ブロックエディタで投稿・固定ページを編集
2. 左上の「リストビュー」アイコンをクリック（または Shift+Alt+O）
3. 画像ブロックのラベルがファイル名で表示されます

## よくある質問

### フロントエンドに影響はありますか？

いいえ、このプラグインはエディタ画面のみで動作し、フロントエンドには一切影響しません。

### 対応している画像形式は？

すべての画像形式に対応しています。拡張子を含めたファイル名全体が「画像 mongol-cow.png」のように表示されます。

### どのバージョンの WordPress で動作しますか？

WordPress 6.0 以降で動作します。WordPress 6.9 まで動作確認済みです。

## 変更履歴

### 1.1.0
- **[Added] 画像ID表示機能を追加**: 重複ファイル名の識別を改善
- **[Added] リストビュー画像サムネイルサイズを26pxに拡大**: 視認性を向上
- **[Changed] ファイル名短縮ルールを変更**: 先頭3文字+末尾8文字に最適化
- **[Changed] 画像ID表示形式を変更**: 括弧を削除してシンプルに
- **[Changed] 英語ベースの翻訳システムに変更**: 国際化対応を改善
- **[Added] uninstall.php を追加**: WordPress.org 審査対応
- **[Added] Plugin URI を追加**: プラグインヘッダーを完全化
- **[Fixed] 翻訳JSONファイルのドメインを修正**: 翻訳が正しく読み込まれるように

### 1.0.8
- **[Major] editor.BlockNavigationBlock フィルターを追加**: WordPress 6.3+ の List View 対応
- **[Major] WordPress.org 規約に準拠**: 全バージョン（6.0-6.9）対応を実現
- **[Info] wp-element を依存関係に追加**
- **[Info] 公開 API のみ使用**: `__experimentalLabel` 不使用

### 1.0.7
- **[Major] __experimentalLabel の使用を削除**: WordPress.org 規約準拠
- **[Major] blocks.getBlockLabel のみを使用**: 安定 API 実装に変更
- **[Major] alt テキストの短縮・拡張子付与問題を修正**: alt はそのまま表示
- **[Minor] languages フォルダと翻訳ファイルを追加**: POT, PO, JSON
- **[Info] WordPress 6.3+ の List View で動作しない可能性**: 安定 API 使用のため

### 1.0.6
- **[Major] 国際化対応**: wp.i18n の翻訳関数を使用
- **[Major] wp_set_script_translations を追加**: JavaScript の翻訳をサポート
- **[Major] wp-i18n を依存関係に追加**
- **[Minor] デバッグログ削除**: console.log を削除
- **[Minor] 未使用ファイル削除**: editor.css を削除
- **[Info] __experimentalLabel の使用について説明を追加**: WordPress 6.3+ の List View では必須

### 1.0.5
- 拡張子を含めたファイル名全体を表示するように変更（括弧付き拡張子を削除）
- 短縮ルールを変更: 18文字以上の場合に前後6文字 + 拡張子
- 表示形式を「画像 ファイル名.拡張子」に変更

### 1.0.4
- WordPress 6.5+ の stripHTML() によるファイル名消失問題を修正
- 山括弧 `< >` を削除してプレーンテキストのみに変更

### 1.0.2
- attributes が undefined のケースに対応（メディア未選択時やLazy Load中のエラーを修正）
- context 形式の判定を汎用化（文字列/オブジェクト両対応、WordPress 6.0-6.7 全バージョンで動作）
- blocks.getBlockLabel フィルターを追加（WordPress 6.0-6.2 互換性向上）

### 1.0.0
- 初回安定版リリース

[完全な変更履歴を見る](readme.txt#changelog)

## 技術仕様

### アーキテクチャ

- **フィルター**: `blocks.registerBlockType` で `__experimentalLabel` を追加（WP 6.3+）
- **互換性フィルター**: `blocks.getBlockLabel` を併用（WP 6.0-6.2 対応）
- **安全な実装**: attributes が undefined の場合も適切に処理
- **汎用的な context 判定**: 文字列/オブジェクト形式の両方に対応

### ファイル構成

```
andw-imagenamelabel/
├── andw-imagenamelabel.php  # メインプラグインファイル
├── assets/
│   ├── editor.js             # エディタ用JavaScript
│   └── editor.css            # （未使用・削除予定）
├── readme.txt                # WordPress.org用README
└── README.md                 # このファイル
```

## ライセンス

GPLv2 or later

## 作者

- **作者**: yasuo3o3
- **作者 URI**: https://yasuo-o.xyz/
- **プラグイン URI**: https://github.com/yasuo3o3/andw-imagenamelabel

## サポート

バグ報告や機能要望は [GitHub Issues](https://github.com/yasuo3o3/andw-imagenamelabel/issues) でお願いします。

## 貢献

プルリクエストを歓迎します！大きな変更の場合は、まず Issue を開いて変更内容を議論してください。

---

Made with ❤️ for WordPress community
