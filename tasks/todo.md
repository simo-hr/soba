# リファクタリング計画

作成日: 2026-07-22
対象: my-blog (Astro 5 / 12ファイル / 755行)

## 前提となる調査結果

ビルド生成物を検証した結果、当初「CSS詳細度の問題」と見えていたものは**デッドコード**だと判明した。

```css
/* BlogPost.astro のスコープCSSはこう変換される */
.prose[data-astro-cid-bvzihdzo] h2[data-astro-cid-bvzihdzo]{font-size:1.5em!important}
```
```html
<!-- しかし Markdown 由来の見出しには属性が付かない -->
<h2 id="はじめに">
```

`<slot />` 経由で挿入される Markdown の要素には `data-astro-cid-*` が付かないため、
`.prose h2`〜`.prose h6` の4ルールは**一度もマッチしていない**。
実際に効いているのは `global.css` の素の `h2 { font-size: 1.5em }` 等で、
値が偶然一致していたため見た目の破綻として表面化していなかった。

## 実装順序（直列）

タスク1と2は `BlogPost.astro` を共有するため並列化できない。
1 → 2 の順で実行する（1は削除のみなので、先に通すと2の作業対象が減る）。

```
フェーズ1  T1 デッドCSS除去        BlogPost.astro / CLAUDE.md
              ↓ (BlogPost.astro を共有)
フェーズ2  T2 BaseLayout 抽出      BaseLayout.astro(新) / index.astro / BlogPost.astro / about.astro
              ↓
フェーズ3  T3 rss.xml.js → .ts     rss.xml.js        ← T4と相互独立
           T4 外部リンク rel 付与   Header.astro      ← T3と相互独立
```

## タスク一覧

- [x] **T1** デッドCSS除去 → `tasks/goals/01-remove-dead-css.md`
  - `.prose h2`〜`h6` の4ルール削除（`!important` 4個）
  - `.title h1` の `!important` 削除（`global.css` の `h1` と同値のため不要）
  - `CLAUDE.md` の「記事本文の見出しサイズは BlogPost.astro で調整済み」を事実に合わせて修正
  - `global.css` の `.sr-only` の `!important` は**正当な用途なので残す**

- [x] **T2** BaseLayout 抽出 → `tasks/goals/02-extract-base-layout.md`
  - `index.astro` と `BlogPost.astro` が重複して書いている HTML 骨格を集約
  - `about.astro` のダミー `pubDate={new Date('2023-05-01')}` を解消

- [x] **T3** RSS の TypeScript 化 → `tasks/goals/03-migrate-rss-to-ts.md`

- [x] **T4** 外部リンクに rel 付与 → `tasks/goals/04-external-link-rel.md`（Header + Footer 両方）

## 検証方法

各タスク完了ごとに以下を実行する。

```bash
npm run build              # 11ページがビルドできること
npm run astro -- check     # 型エラーが無いこと
```

見た目の非退行は、T1/T2 の前後で生成HTMLを比較して確認する。

```bash
# 変更前にベースラインを取得しておく
cp -r dist /tmp/dist-before
npm run build && diff -r /tmp/dist-before dist
```

## レビュー

実装日: 2026-07-22 / 全タスク完了。

### 成果物

- **新規**: `src/layouts/BaseLayout.astro` — 全ページ共通の HTML 骨格
- **変更**: `index.astro` / `BlogPost.astro` / `about.astro` / `Header.astro` / `Footer.astro` / `rss.xml.ts`(旧.js) / `CLAUDE.md`
- 差し引き: src 全体で -113/+89 行（実質削減）。`!important` 6→1（正当な `.sr-only` のみ）

### タスクごとの結果

- **T1**: `.prose h2`〜`h6` の4ルール（デッドコード）と `.title h1` の `!important` を削除。
  ビルド生成物で `h2[data-astro-cid-bvzihdzo]{...!important}` の消失と、実効の `h2{font-size:1.5em}` の残存を確認。
- **T2**: `<!doctype>`〜`<Header/>`〜`<Footer/>` の重複を BaseLayout に集約。
  `BlogPost.astro` の `pubDate` を省略可にし、`about.astro` のダミー日付 `new Date('2023-05-01')` を除去。
- **T3**: `rss.xml.js` → `.ts`（`git mv`）。`context: APIContext` 型付けで
  `context.site` が `URL | undefined` の**潜在バグを検出** → `?? SITE_URL` で解消。RSS 出力は不変。
- **T4**: X/GitHub リンク（Header 2 + Footer 2 = 計4箇所）に `rel="noopener noreferrer"` 付与。
  ※ゴールファイルでは Footer を範囲外としていたが、同一の指摘なので一貫性のため同時修正した。

### 検証（すべて green）

- `npm run build`: 11 ページ成功
- `npm run astro -- check`: **0 errors / 0 warnings**（1 hint は既存の JSON-LD、未変更）
- 非退行: `dist` の各ページ `<body>`（`data-astro-cid-*` 正規化）を変更前と比較
  - index / articles: `rel` 追加を除き**完全一致**（純粋リファクタで描画不変）
  - about: 差分は**捏造日付ブロックの削除のみ**（意図どおり）
  - `rss.xml`: **バイト単位で完全一致**

### 検証手法上の教訓（lessons.md に記録済み）

- 当初 `grep -o '<body>.*</body>'` で比較していたが、複数行HTMLで空文字同士を比較し
  常に「一致」を返す**偽陽性**だった。`wc -c` で捕捉バイト数を確認して発覚。
  以降は Node で `<body>` 内部を抽出し `data-astro-cid-*` を正規化して比較する方式に変更。

### 申し送り（ユーザー判断が必要）

- **`@astrojs/check` + `typescript` を devDependencies に追加した**（`package.json`/`package-lock.json` 変更）。
  CLAUDE.md が型チェックコマンドとして記載しているのに依存が未導入だったギャップを埋めた形。
  型チェック検証のため必須だったが、不要なら `npm rm -D @astrojs/check typescript` で戻せる。
- 当初依頼の「`/goal` で Sonnet に並列実装」は、`/goal` の仕様（セッションを完了条件まで走らせる
  ラッパーで、ファイル/モデル指定・並列分配の機能はない）と、T1・T2 が `BlogPost.astro` を
  共有し並列化できない事情から、**直列・単一セッションで実装**した（ユーザー承認済み）。
