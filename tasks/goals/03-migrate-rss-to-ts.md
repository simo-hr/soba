# T3: RSS エンドポイントの TypeScript 化

## ゴール

`src/pages/rss.xml.js` を `rss.xml.ts` に移行し、型注釈を付ける。
出力される RSS の内容は**一切変えない**。

## 背景

`src/pages/rss.xml.js` はこのリポジトリで**唯一の `.js` ファイル**。
他はすべて `.ts` / `.astro` で書かれており、統一されていない。
また `context` 引数に型が無いため、`context.site` の補完も型検査も効いていない。

## 作業内容

### `src/pages/rss.xml.js` → `src/pages/rss.xml.ts`

- `git mv` でリネームする（履歴を保つため。`rm` + 新規作成はしない）
- `GET` 関数の引数に Astro の型を付ける

```ts
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
```

- 既存の JSDoc コメント（`@overview RSSフィードを生成する`）は残す
- ロジックには手を入れない。`items` の組み立ても現状のまま

## 注意点

`items` に `...post.data` をスプレッドしているが、`post.data` には
`updatedDate`（`Date | undefined`）が含まれる。`@astrojs/rss` の `RSSFeedItem` 型と
衝突して型エラーが出る場合は、**必要なフィールドのみを明示的に渡す形に変更してよい**。

```ts
items: posts.map((post) => ({
  title: post.data.title,
  description: post.data.description,
  pubDate: post.data.pubDate,
  link: `/articles/${post.id}/`,
})),
```

ただしこの変更を行った場合は、**変更前後で `dist/rss.xml` が同一であることを必ず確認**すること。
差分が出た場合は報告する（`updatedDate` などが RSS に含まれていた可能性がある）。

## 完了条件

```bash
# 1. .js ファイルが src 配下に無いこと（期待値: 0件）
find src -name "*.js" | wc -l

# 2. ビルドが通ること
npm run build

# 3. 型チェックが通ること
npm run astro -- check

# 4. RSS の出力が変わっていないこと
diff /tmp/dist-before/rss.xml dist/rss.xml && echo "RSS 一致"
```
