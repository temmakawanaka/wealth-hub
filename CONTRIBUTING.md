# 開発手順

## 環境を揃える

Node.js 22.x（22.12.0以上）とnpm 10.xを使用する。`.nvmrc` はNodeのメジャー系列を指定し、パッチ更新は受け入れる。`package.json` の `engines.node` は依存関係の最低要件であり、全ての後続メジャーのサポートを宣言するものではない。開発環境の上限とnpm系列は `verify:env` が追加検証する。

nvmを利用できる環境では `nvm install` と `nvm use` を実行する。Windowsでは利用中のバージョン管理ツールで `.nvmrc` と同じ22系を選択する。セットアップのために有料サービスやAWS環境は必要ない。

```bash
node --version
npm --version
npm run verify:env
npm ci
npm run check
```

`npm ci` はコミット済みlockfileを使う。依存を追加・更新しないPRではlockfileを再生成しない。Nodeのメジャー更新時は `.nvmrc`、環境検証コードとテスト、enginesとlockfile、`@types/node`、CI、文書をセットで見直す。`@types/node`だけを実行環境より先にメジャー更新しない。既存Dependabot PRもこの方針でレビューする。

## 日常のコマンド

```bash
npm run dev
npm test
npm run test:tooling
npm run format
npm run check
```

`npm run check` はCIと共通のフル検証コマンド。環境検証、TypeScript、ESLint、Prettier、Vitest、Node標準のツールテスト、ビルド、リポジトリ衛生、npm auditを順番に実行し、どれかが失敗したら非ゼロ終了する。

依存のインストールと監査には外部ネットワークが必要。オフラインで個別テストを実行できても、監査を省略してフル検証成功とは報告しない。CodeQLは別のGitHub Actions workflowで実行し、ローカルの成功とは分けて確認する。

## OS・パス・改行

LinuxとWindowsのCIで同じ検証を実行する。テストは日本語・空白を含む一時フォルダーと異なる作業ディレクトリを使用する。ファイルURLは `fileURLToPath` でOSのパスに変換する。

`.gitattributes` はテキストをLFに統一する。既存の作業コピーにCRLFが残る場合は、未コミットの変更を退避してから再取得する。変更を失う一括リセットは行わない。

## PRとマージ

小さな変更単位でPRを作り、関連Issue、検証結果、対象外、未検証事項を記載する。実装と検証が終わるまでIssueを完了扱いにしない。

CIはOSごとの `validate` を実行し、集約job `quality` はすべて成功したときだけ成功する。CodeQLは独立した必須確認対象とする。最新headのCI・CodeQL・その他導入済みチェックが成功してからマージし、進行中・失敗・キャンセル・意図しないスキップを成功扱いにしない。

ブランチ保護の設定は #19 で管理する。workflowの追加だけでGitHub側のマージ制限が有効になったとは扱わない。カバレッジ、シークレット内容検査、Dependency Review、ブラウザーE2Eは各Issueの完了後に必須チェックへ追加する。

## 安全性

コード、テスト、Issue、ログ、スクリーンショットには合成データだけを使用する。現行のファイル名検査は専用シークレットスキャナーの代替ではない。認証・外部サービス接続・デプロイは別段階であり、開発基盤整備のために実明細やクラウド認証情報を入力しない。
