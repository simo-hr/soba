# Goal: BlogPost.astro を BaseLayout に載せ替え + 見出し !important 除去

## 所有ファイル
- `src/layouts/BlogPost.astro`

## 依存（凍結済み contract）
- `src/layouts/BaseLayout.astro`（Phase 2）
- `src/styles/global.css` に prose 見出しルールが移管済み（Phase 1, `phase1-global-css.md`）

## タスク
1. 重複していた HTML 骨格を削除し、`<BaseLayout title={title} description={description}>` で包む。
2. ページ固有の `<style>`（`.prose`, `.title`, `.date` 等）は名前付きスロット `<slot name="head">` 向けに差し込む。
3. **見出し上書きの除去**: `.prose h2/h3/h4/h5/h6` の `font-size: ... !important` と margin 群は `global.css` 側へ移管済みのため、ここから削除する。`.title h1 { font-size: 2em !important }` も `!important` を外せるか確認し、不要な `!important` を解消する。
4. `<article><div class="prose">...<slot /></div></article>` の本文構造、日付/更新日表示（`FormattedDate`）は維持。

## 注意
- `global.css` 側の prose 見出しルール移管は `phase1-global-css.md` が担当済みである前提。値が一致していることを確認すること。

## 完了条件
- 記事ページの見た目（見出しサイズ・余白）が現行と一致し、`!important` が解消されている。
- `npm run build` を壊さない。
