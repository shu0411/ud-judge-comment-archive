# ud-judge-comment-archive 仕様書

## プロジェクト概要

UNIDOLという大学生アイドルの大会における、審査員コメント（講評）を大会・試合日程ごとにアーカイブする非公式ファンサイト。

出場者が過去の審査員コメントを振り返って流し読みできることを主な目的とする。

**サイトタイトル**: UNIDOL 審査員コメントまとめ  
**リポジトリ名**: `ud-judge-comment-archive`  
**注意**: このサイトはファンによる非公式サイトであり、UNIDOL公式とは無関係である旨をHeader内に明記すること。

---

## 技術スタック

| 項目 | 選定内容 |
| ------ | --------- |
| フレームワーク | Vite + React |
| スタイリング | Tailwind CSS |
| データ管理 | `src/data/tweetList.json`（ビルド時にバンドル） |
| ホスティング | Netlify（GitHub連携による自動デプロイ） |

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
      },
      {
        "id": "unidol-2026-summer-kanto3",
        "label": "関東予選3日目",
        "tweets": []
      }
    ]
  },
  {
    "id": "unidol-2025-26-winter",
    "label": "UNIDOL 2025-26 Winter",
    "events": []
  }
]
```

投稿アカウントは単一（運営者本人のXアカウント）である前提のため、`tweets` はツイートIDの配列のみ保持する。ツイートURLはアカウントハンドル（定数管理）とIDから組み立て、本文はX埋め込みウィジェットで取得・表示する。

---

## コンポーネント構成

```txt
App
├ Header                 # サイトタイトル・非公式表記
├ Controls               # 「全て展開」「全て折りたたむ」ボタン
├ TableOfContents        # PC: 固定サイドバー / Mobile: ドロワー形式
└ TournamentList
   └ TournamentSection   # 大会単位（id付き、アンカーリンク対象・開閉可）
      └ EventSection     # 試合単位（開閉可）
         └ TweetEmbed    # X埋め込みウィジェット
```

---

## 機能仕様

### 開閉制御

| 機能 | 仕様 |
| ------ | ------ |
| 初期表示 | 全展開（TournamentSection・EventSection ともに開いた状態） |
| 「全て折りたたむ」ボタン | TournamentSection を全て閉じる（EventSection・ツイートも隠れる） |
| 「全て展開する」ボタン | 全展開状態に戻す |
| 個別開閉 | TournamentSection・EventSection それぞれ個別にクリックで開閉可能 |

### 目次

| 環境 | 挙動 |
| ------ | ------ |
| PC（md以上） | 左固定サイドバーとして常時表示 |
| Mobile（md未満） | 画面上部に「☰ 目次」ボタンを設置し、タップでドロワー展開 |
| 目次クリック | 該当 TournamentSection へスムーズスクロール |
| 目次の内容 | 大会名のみ列挙（試合日程は目次には含めない） |

### ツイート埋め込み

- X（Twitter）公式ウィジェットスクリプト（`widgets.js`）を使用
- `<blockquote class="twitter-tweet">` + `window.twttr.widgets.load()` で実装
- EventSection の開閉アニメーション後にも正しく描画されるよう、`load()` の呼び出しタイミングに注意

### テーマ

- モノトーン（白・グレー・黒）ベースのシンプルなデザイン
- `prefers-color-scheme` に従ってライト/ダークを自動切替
- Tailwind CSS の `dark:` バリアントを使用

---

## ページレイアウトイメージ

### PC

```txt
┌─────────────────────────────────────────────┐
│  Header: UNIDOL 審査員コメントまとめ（非公式）  │
├──────────┬──────────────────────────────────┤
│  目次    │  [全て展開] [全て折りたたむ]        │
│          │                                  │
│  2026S   │  ## UNIDOL 2026 Summer           │
│  2025W   │    ### 決勝戦                    │
│  2025F   │      [tweet] [tweet] ...         │
│          │    ### 敗者復活戦                 │
│          │      [tweet] ...                 │
│          │                                  │
│          │  ## UNIDOL 2025-26 Winter        │
│          │    ...                           │
└──────────┴──────────────────────────────────┘
```

### Mobile

```txt
┌──────────────────────┐
│ ☰ 目次  タイトル     │
├──────────────────────┤
│ [全て展開][全て折りたたむ] │
│                      │
│ ## UNIDOL 2026 Summer│
│   ### 決勝戦         │
│     [tweet]          │
│     [tweet]          │
│   ### 敗者復活戦     │
│     ...              │
└──────────────────────┘
```

---

## Netlify 設定

- Viteプロジェクトはリポジトリルート直下ではなく `ud-judge-comment-archive/` にネストしているため、`netlify.toml` はリポジトリルートに置き、`base`/`publish` でその配下を指定する
- ビルドコマンド: `npm run build`
- 公開ディレクトリ: `ud-judge-comment-archive/dist`
- GitHubリポジトリと連携し、`main` ブランチへのpushで自動デプロイ
- SPA向けリダイレクト設定を含めること

```toml
[build]
  base = "ud-judge-comment-archive/"
  command = "npm run build"
  publish = "ud-judge-comment-archive/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 将来的な拡張候補（現時点では実装不要）

- OGP設定（SNSシェア用）
- 投稿の新規登録・編集・削除機能
