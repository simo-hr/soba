# Goal: BaseHead.astro の整理（JSON-LD 分離）

## 所有ファイル
- `src/components/BaseHead.astro`
- （任意）`src/lib/structuredData.ts` などのヘルパー新規作成

## ゴール
`<head>` メタタグ設定の責務を保ちつつ、肥大したインライン JSON-LD 構造化データを切り出して可読性を上げる。

## タスク
1. インラインの `JSON.stringify({...Blog schema...})` を、純粋関数（例: `buildBlogJsonLd()`）として切り出す。
   - 配置先は新規 `src/lib/structuredData.ts`（推奨）か、最低でも BaseHead の frontmatter 内のローカル定数に整理。
   - `consts.ts` の値（`SITE_TITLE`, `SITE_URL`, `SITE_DESCRIPTION`, `AUTHOR_NAME`）を引数 or import で使用。出力 JSON の内容は現行と同一に保つ。
2. `Props`・canonical URL・OGP/Twitter メタの既存挙動は変更しない。
3. 重複している URL 生成（`new URL(image.src, Astro.site)` が og:image と twitter:image で 2 回）は必要なら 1 つのローカル定数にまとめてよい。

## 完了条件
- 生成される `<head>` の出力が現行と同一（特に JSON-LD の中身）。
- `npm run build` を壊さない。
