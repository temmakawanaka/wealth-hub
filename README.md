# wealth-hub

個人向け家計・資産管理アプリの**架空データ専用プロトタイプ**です。現段階ではログイン、データ永続化、銀行・カード・証券会社との接続はありません。

## 技術スタック

- React + TypeScript (strict)
- Vite
- Vitest
- ESLint + Prettier
- GitHub Actions + CodeQL + Dependabot

## 開発方法

Node.js 22 を使用します。

```bash
npm ci
npm run dev
npm run check
npm run build
```

`npm run dev` の表示するローカルURLで表示できます。AWSデプロイは未実施です。

## プライバシーとセキュリティ

このリポジトリは公開されています。口座番号、本人の実際の資産額、利用明細、APIキー、トークンはコミットしないでください。UIは架空データだけを表示し、保存・外部送信しません。金融サービス接続の前にCognitoの認証、バックエンド認可、ユーザー分離、暗号化、ログのマスキング等を別途実装します。

開発方針は [ADR 0001](docs/adr/0001-technology-stack.md)、セキュリティ報告については [SECURITY.md](SECURITY.md) を参照してください。
