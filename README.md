# wealth-hub

個人向け家計・資産管理アプリの**架空データ専用プロトタイプ**です。ログイン、データ永続化、金融口座との接続、AWSデプロイは未実装です。

## 技術スタック

React + strict TypeScript + Vite、Vitest、ESLint、Prettier、GitHub Actions、CodeQL、Dependabotを使用しています。開発スクリプトはNode.js標準機能でテストします。

## 開発方法

サポートする開発環境は **Node.js 22.x（22.12.0以上）とnpm 10.x** です。Nodeの選択は `.nvmrc`、実際の検証は `verify:env` に揃えています。WindowsとLinuxの両方をCIで検証します。

```bash
npm run verify:env
npm ci
npm run check
npm run dev
```

`npm run check` は型、lint、整形、単体テスト、開発ツールのテスト、ビルド、リポジトリ検査、依存関係監査を実行します。ローカルとCIで同じコマンドを使います。依存の取得と `npm audit` にはネットワーク接続が必要です。

`npm run dev` のローカルURLで表示できます。ブラウザーE2Eと開発用CSPの整備は #17・#18 で扱います。ビルド成功だけでブラウザー動作の検証が済んだとは扱いません。

詳細なセットアップ・検証・PRのルールは [CONTRIBUTING.md](CONTRIBUTING.md)、技術方針は [ADR 0001](docs/adr/0001-technology-stack.md)、金額計算は [金額の契約](docs/domain-money.md) を参照してください。

## プライバシーとセキュリティ

このリポジトリは公開されています。口座番号、実残高、利用明細、APIキー、トークンをコミットしないでください。デモは合成データだけを扱います。実データを使う前に認証・サーバー側認可・ユーザー分離・暗号化・ログ保護が必要です。

現行リポジトリ検査はファイル名・改行等の検査であり、シークレットの内容検査は #14 の未実装項目です。セキュリティ報告は [SECURITY.md](SECURITY.md) を参照してください。
