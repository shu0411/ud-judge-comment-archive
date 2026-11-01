# ud-judge-comment-archive

UNIDOL審査員コメントまとめサイト（非公式ファンサイト）。

- 仕様書: [docs/spec.md](docs/spec.md)
- アプリ本体: [ud-judge-comment-archive/](ud-judge-comment-archive/)（セットアップ・開発コマンドはこちらのREADME参照）
- デプロイ: Netlify（GitHub連携、`main` ブランチへのpushで自動デプロイ。設定は [netlify.toml](netlify.toml)）
- ツイートの追加: 「ツイート追加」Issue（[.github/ISSUE_TEMPLATE/add-tweets.yml](.github/ISSUE_TEMPLATE/add-tweets.yml)）を起票すると、`tweetList.json` を更新するPull Requestが自動作成される（詳細は [docs/spec.md](docs/spec.md)）
