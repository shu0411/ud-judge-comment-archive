# AGENTS.md

UNIDOL（大学生アイドルの大会）の審査員コメントを大会・日程ごとにアーカイブする非公式ファンサイト。詳細な仕様は [docs/spec.md](docs/spec.md) を参照。

## リポジトリ構成

Viteアプリ本体はルート直下ではなく `ud-judge-comment-archive/` にネストしている。npmコマンドは必ずそのディレクトリで実行すること。

```txt
/
├ .github/
│  ├ ISSUE_TEMPLATE/      # requirement.md（要件）・add-tweets.yml（ツイート追加フォーム）
│  └ workflows/           # add-tweets.yml・ci.yml、Issue駆動フロー・Dependabot PRレビュー
│                         # （詳細は shu0411/.github）の呼び出し側workflow
├ docs/spec.md            # 仕様書（挙動を変えたら更新する）
├ netlify.toml            # デプロイ設定（base/publishはネスト構成前提）
└ ud-judge-comment-archive/   # Vite + React + TypeScript アプリ本体
   ├ src/
   │  ├ components/       # Header, TableOfContents, SiteNotice,
   │  │                   # TournamentList > TournamentSection > EventSection > TweetEmbed
   │  ├ data/tweetList.json  # 大会・日程・ツイートIDの実データ
   │  ├ constants.ts      # 投稿者ハンドルと tweetUrl()
   │  ├ theme.ts          # MUIテーマ、HEADER_HEIGHT / DRAWER_WIDTH
   │  └ types.ts          # Tournament / Event 型
   ├ scripts/add-tweets/  # 「ツイート追加」Issueを解析しtweetList.jsonを更新するスクリプト
   └ e2e/                 # Playwrightテストとfixtureデータ
```

## コマンド（`ud-judge-comment-archive/` で実行）

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 型チェック（`tsc -b`）+ プロダクションビルド |
| `npm run lint` | ESLint |
| `npm test` | Vitest ユニットテスト（`scripts/` が対象。Playwrightのspecは対象外） |
| `npm run test:e2e` | Playwright e2eテスト（開発サーバーは自動起動） |

## ツイート追加フロー（`scripts/add-tweets/`）

「ツイート追加」Issue（`.github/ISSUE_TEMPLATE/add-tweets.yml`）の起票・編集を起点に、
`.github/workflows/add-tweets.yml` が `tweetList.json` を更新するPull Requestを作成する。
処理の詳細（モジュール構成・CIの起動方法・エラー時の挙動など）は [docs/spec.md](docs/spec.md) を参照。

- 各モジュールは純粋関数として実装し、Vitestでユニットテストする（TDD）
- `main.ts` のみが環境変数の読み取り・ファイルI/O・GitHub Actionsへの出力を担う
- ID の比較には `BigInt` を使う（19桁のツイートIDは `Number` の安全な範囲を超える）

## 技術スタックと方針

- UIはMUI（Material UI）+ Emotion。アイコンは `@mui/icons-material`
- **MUIのデフォルトを優先する。** コンポーネントはまずライブラリ標準のまま組み、カスタマイズ（sxでの上書き等）は表示を確認して必要になってから最小限で行う
- テーマはライト/ダーク両対応（`colorSchemes` + `defaultMode="system"`）。色やサイズの定数は `theme.ts` に集約
- バックエンド・外部APIなし。データは `src/data/tweetList.json` をビルド時にバンドル
- UIテキストは日本語

## データの扱い

- `tweetList.json` はimport文で直接参照せず、必ずViteエイリアス `@data/tweetList` 経由で読み込む。e2e実行時（`--mode e2e`）はこのエイリアスが `e2e/fixtures/tweetList.json` に差し替わる（`vite.config.ts`）
- 配列の先頭が最新大会。新しい大会・日程は先頭に追加する
- ツイートは投稿者アカウントが単一である前提で、IDの配列のみ保持。URLは `constants.ts` の `tweetUrl()` で組み立てる

## テスト

- e2eテストは実データではなくfixture（`e2e/fixtures/tweetList.json`）に対して書く
- **見た目の実装詳細ではなく、ユーザーに見える挙動をアサートする。** CSSクラスやDOM構造ではなく、ロール・見出し・テキストの表示/非表示で検証する（スタイルそのものが要件の場合を除く）
- desktop（1280px）/ mobile（390px）の2プロジェクト構成。レスポンシブな挙動は両方で確認する
- `workers: 1` 固定（サンドボックス環境での並列起動タイムアウト対策）。変更しない

## 注意点・ハマりどころ

- ツイート埋め込みはX公式の `widgets.js` に依存する。オフライン環境やスクリプトブロック時は描画されないが、`TweetEmbed` はリトライして静かに諦める設計。埋め込み本文の内容に依存するテストは書かない
- 大会・日程の見出しはsticky。位置は `HEADER_HEIGHT` 基準なのでヘッダー高さを変える場合は追従を確認する
- 目次クリック時のスクロールはアコーディオン展開とアニメーションの競合をResizeObserverで補正している（`TableOfContents.tsx`）。開閉まわりを触ったらこの挙動を再確認する
- `netlify.toml` の `publish = "dist"` は `base` からの相対パス。`ud-judge-comment-archive/dist` と書くと二重になり壊れる
- 挙動や構成を変えたら `docs/spec.md` も更新する
