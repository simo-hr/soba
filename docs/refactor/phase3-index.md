# Goal: index.astro を BaseLayout に載せ替え

## 所有ファイル
- `src/pages/index.astro`

## 依存（凍結済み contract）
- `src/layouts/BaseLayout.astro`（Phase 2）

## タスク
1. 重複していた `<!doctype html>...<head><BaseHead/></head><body><Header/>...<Footer/>` 骨格を削除し、`<BaseLayout title={SITE_TITLE} description={SITE_DESCRIPTION}>` で包む。
2. ページ固有の `<style>`（`.post-list` 等）は BaseLayout の名前付きスロット `<slot name="head">` 向けに `<style slot="head">` で差し込む（または BaseLayout の方式に合わせる）。
3. `<main>` 配下の記事一覧 markup（`getCollection` ソート、`post-list`）と既存スタイルは維持。`<Header />` / `<Footer />` の直書きは BaseLayout 側に移ったので削除。
4. 不要になった import（`BaseHead`, `Header`, `Footer`）を整理。

## 完了条件
- トップページの見た目・記事一覧（公開日降順）が現行と一致。
- `npm run build` を壊さない。
