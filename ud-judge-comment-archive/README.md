# ud-judge-comment-archive

UNIDOL審査員コメントまとめサイト。UNIDOLの各大会・日程ごとに、審査員コメント（X上のツイート）をアーカイブする非公式のファンサイトです。詳細な仕様は [../docs/spec.md](../docs/spec.md) を参照してください。

## 技術スタック

- Vite + React + TypeScript
- MUI（Material UI）+ Emotion
- データはビルド時にバンドルする `src/data/tweetList.json`（外部APIやバックエンドは使用しない）
- Netlify（GitHub連携による自動デプロイ）

## セットアップ

```bash
npm install
npm run dev
```

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック（`tsc -b`）とプロダクションビルド |
| `npm run lint` | ESLint |
| `npm run preview` | ビルド成果物をローカルでプレビュー |
| `npm run test:e2e` | Playwrightによるe2eテスト |

## データの管理

大会・日程・ツイートの情報は [`src/data/tweetList.json`](src/data/tweetList.json) に定義します（型定義は [`src/types.ts`](src/types.ts)）。ツイートは投稿者アカウントが単一である前提で、ツイートIDの配列のみを保持し、URLは [`src/constants.ts`](src/constants.ts) の `tweetUrl()` で組み立てます。投稿者アカウントを変更する場合は `TWEET_AUTHOR_HANDLE` を書き換えてください。

## e2eテスト

`e2e/` 以下にPlaywrightのテストがあります。実データ（`src/data/tweetList.json`）は随時更新されるため、テストは実データではなく [`e2e/fixtures/tweetList.json`](e2e/fixtures/tweetList.json) という固定のfixtureデータに対して実行します。この切り替えは `vite.config.ts` 内で、Viteの `--mode e2e` 起動時のみ `@data/tweetList` のエイリアス解決先をfixtureに向けることで実現しています（通常の `dev`/`build` では本番データを使用）。

```bash
npm run test:e2e
```

## デプロイ

Netlifyの設定はリポジトリルートの `netlify.toml`（このディレクトリの一つ上の階層）にあります。`main` ブランチへのpushで自動デプロイされます。
