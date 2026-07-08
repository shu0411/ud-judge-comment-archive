# ud-judge-comment-archive 仕様書

## プロジェクト概要

UNIDOLという大学生アイドルの大会における、審査員コメント（講評）を大会・日程ごとにアーカイブする非公式ファンサイト。

出場者が過去の審査員コメントを振り返って流し読みできることを主な目的とする。

**サイトタイトル**: UNIDOL 審査員コメントまとめ
**リポジトリ名**: `ud-judge-comment-archive`
**注意**: このサイトはファンによる非公式サイトであり、UNIDOL公式とは無関係である旨をページ内（ヘッダー直下の注意書き）に明記すること。

---

## 技術スタック

| 項目 | 選定内容 |
| ------ | --------- |
| フレームワーク | Vite + React + TypeScript |
| UIライブラリ | MUI（Material UI）+ Emotion |
| アイコン | `@mui/icons-material` |
| データ管理 | `src/data/tweetList.json`（ビルド時にバンドル） |
| E2Eテスト | Playwright |
| ホスティング | Netlify（GitHub連携による自動デプロイ） |

Viteプロジェクト本体はリポジトリルート直下ではなく `ud-judge-comment-archive/` にネストしている。

---

## データ構造

`src/data/tweetList.json` に以下の形式で定義する。
配列の先頭が最新大会（新しい順）。

```json
[
  {
    "id": "unidol-2026-summer",
    "label": "UNIDOL 2026 Summer",
    "events": [
      {
        "id": "unidol-2026-summer-final",
        "label": "決勝戦",
        "tweets": ["1234567890"]
      },
      {
        "id": "unidol-2026-summer-repechage",
        "label": "敗者復活戦",
        "tweets": []
      }
    ]
  },
  {
    "id": "unidol-2025-winter",
    "label": "UNIDOL 2025-26 Winter",
    "events": []
  }
]
```

型定義は `src/types.ts` の `Tournament` / `Event`。

投稿アカウントは単一（運営者本人のXアカウント）である前提のため、`tweets` はツイートIDの配列のみ保持する。ツイートURLはアカウントハンドル（`src/constants.ts` の `TWEET_AUTHOR_HANDLE`）とIDから `tweetUrl()` で組み立て、本文はX埋め込みウィジェットで取得・表示する。

データはimport文で直接読まず、Viteのエイリアス `@data/tweetList` 経由で読み込む。E2Eテスト時（`--mode e2e`）はこのエイリアスが `e2e/fixtures/tweetList.json` に差し替わる（`vite.config.ts` 参照）。

---

## コンポーネント構成

```txt
App                        # 開閉状態・ドロワー/サイドバー状態を管理
├ Header                   # 固定AppBar（1行）
├ TableOfContents          # PC: 開閉可能サイドバー / Mobile: ドロワー
├ SiteNotice               # サイト説明・非公式表記・免責の注意書き
└ TournamentList
   └ TournamentSection     # 大会単位（id付き、アンカーリンク対象・開閉可）
      └ EventSection       # 日程単位（開閉可）
         └ TweetEmbed      # X埋め込みウィジェット
```

---

## 機能仕様

### 開閉制御

| 機能 | 仕様 |
| ------ | ------ |
| 初期表示 | 最新大会（配列先頭）の TournamentSection のみ展開。EventSection は全て展開状態 |
| 「全て折りたたむ」 | TournamentSection を全て閉じる（EventSection・ツイートも隠れる） |
| 「全て展開」 | TournamentSection・EventSection を全て開く |
| 個別開閉 | TournamentSection・EventSection それぞれ個別にクリックで開閉可能（MUI Accordion） |
| 空状態 | 日程のない大会は「まだ日程が登録されていません。」、ツイートのない日程は「まだコメントが登録されていません。」を表示 |

セクションの中身は `mountOnEnter` で初回展開時に初めてマウントし、以降は閉じてもDOMに保持する（再度開いたときにツイートの再読み込みが発生しない）。

大会・日程の見出し（AccordionSummary）は `position: sticky` でスクロール中も画面上部に張り付く（大会はヘッダー直下、日程は大会見出しの直下）。

### ヘッダー

`position: fixed` の1行AppBar（高さは `theme.ts` の `HEADER_HEIGHT` = 56px）。

```txt
PC:     ┌──────────────────────────────────────────────────┐
        │ [〈] UNIDOL 審査員コメントまとめ   [⤢全て展開][⤡全て折りたたむ] │
        └──────────────────────────────────────────────────┘
Mobile: ┌──────────────────────────────┐
        │ [☰]  タイトル(中央)   [⤢][⤡] │
        └──────────────────────────────┘
```

- 左端: Mobileではハンバーガーボタン（目次ドロワーを開く）、PCではサイドバー開閉ボタン（開いている時は `〈`、閉じている時は `☰`）
- タイトル: Mobileでは中央寄せ、PCでは左寄せで大きめのフォントサイズ
- 右端: 全展開・全折りたたみボタン。アイコンは `UnfoldMore` / `UnfoldLess`。PCではアイコンにテキストラベルを併記、Mobileではアイコンのみ。`title` 属性でツールチップ表示
- PCではサイドバーの開閉に合わせてヘッダーの左端位置・幅がアニメーションで追従する

### 注意書き（SiteNotice）

ヘッダー直下のコンテンツ領域に以下を表示する:

- サイトの説明（審査員コメントのメモ一覧である旨）
- ファンによる非公式サイトであり、UNIDOL公式とは無関係である旨
- 一個人の解釈によるメモのため正確でない可能性がある旨の免責

### 目次

| 環境 | 挙動 |
| ------ | ------ |
| PC（md以上） | 左サイドバー（MUI permanent Drawer、幅 `DRAWER_WIDTH` = 256px）。ヘッダーのボタンで開閉でき、閉じると幅0にアニメーションで縮む（コンテンツがワイドになる） |
| Mobile（md未満） | ヘッダーのハンバーガーボタンで左からスライドインするドロワー（MUI temporary Drawer、幅は画面の75%・最大280px）。オーバーレイのタップまたはドロワー内の✕ボタンで閉じる |
| 目次クリック | 該当の大会を展開したうえでスムーズスクロール（Mobileではドロワーも閉じる） |
| 目次の内容 | 大会名のみ列挙（日程は目次には含めない） |

目次クリック時、閉じていた大会の展開アニメーション中はページ高さが変わりスクロール位置がずれるため、`ResizeObserver` でサイズ変化が落ち着いたのを検知して再度スクロールし位置を補正する。

### ツイート埋め込み

- X（Twitter）公式ウィジェットスクリプト（`widgets.js`）を使用。`index.html` に公式のブートストラップスニペットを置き、`window.twttr.ready()` でロード完了を待つ（ポーリング不要）
- **ビューポート遅延読み込み**: `IntersectionObserver`（`rootMargin: 600px` の先読み）でツイートが画面に近づいたときに初めて埋め込みを生成する。画面から遠いツイートは固定サイズの `Skeleton` プレースホルダーを表示し、スクロールに応じて上から順に読み込まれる
- 読み込み開始後は `<blockquote class="twitter-tweet">` をDOM生成し `window.twttr.widgets.load()` で描画
- `data-conversation="none"` を指定し、スレッド（リプライ元）は表示しない
- `data-theme` に `prefers-color-scheme` の値を反映し、OSテーマ変更時はウィジェットを再生成して追従
- 日程内のツイートは `flex-wrap` で横に並べ、折り返して表示

### テーマ

- MUIの `colorSchemes`（light/dark）を使用し、`defaultMode="system"` でOS設定（`prefers-color-scheme`）に自動追従
- 背景色をカスタマイズ: ライト `#F8FAFC` / ダーク `#1E293B`（`background.default` と `background.paper` 共通）
- `responsiveFontSizes` で画面幅に応じたフォントサイズ調整

---

## ページレイアウトイメージ

### PC

```txt
┌────────┬─────────────────────────────────────────┐
│ 目次   │ [〈] タイトル      [全て展開][全て折りたたむ] │ ← 固定ヘッダー
│        ├─────────────────────────────────────────┤
│ 2026S  │ 注意書き（説明・非公式表記・免責）          │
│ 2025W  ├─────────────────────────────────────────┤
│ 2025F  │ ## UNIDOL 2026 Summer                   │
│        │   ### 決勝戦                             │
│        │     [tweet] [tweet] ...                 │
│        │   ### 敗者復活戦                          │
│        │     ...                                 │
│        │ ## UNIDOL 2025-26 Winter（折りたたみ）     │
└────────┴─────────────────────────────────────────┘
```

### Mobile

```txt
┌──────────────────────┐
│ [☰]  タイトル  [⤢][⤡] │ ← 固定ヘッダー
├──────────────────────┤
│ 注意書き              │
├──────────────────────┤
│ ## UNIDOL 2026 Summer│
│   ### 決勝戦         │
│     [tweet]          │
│     [tweet]          │
│   ### 敗者復活戦     │
│     ...              │
└──────────────────────┘
```

---

## E2Eテスト

Playwrightによるe2eテストを `e2e/` に置く（`npm run test:e2e`）。

- `desktop.spec.ts` / `mobile.spec.ts` の2プロジェクト構成（ビューポート幅 1280px / 390px）
- テスト実行時は `vite --mode e2e` で開発サーバーを起動し、データを `e2e/fixtures/tweetList.json` に差し替える
- CSSクラスやDOM構造ではなく、ユーザーから見える挙動（見出し・ボタン・テキストの表示）をアサートする

---

## Netlify 設定

- Viteプロジェクトが `ud-judge-comment-archive/` にネストしているため、`netlify.toml` はリポジトリルートに置き、`base` でその配下を指定する（`publish` は `base` からの相対パス）
- GitHubリポジトリと連携し、`main` ブランチへのpushで自動デプロイ
- SPA向けリダイレクト設定を含める

```toml
[build]
  base = "ud-judge-comment-archive/"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 将来的な拡張候補（現時点では実装不要）

- OGP設定（SNSシェア用）
- 投稿の新規登録・編集・削除機能
