# Goal: 一貫性の小改善（rss の TS 化 / 日付ロケール）

## 所有ファイル
- `src/pages/rss.xml.js` → `src/pages/rss.xml.ts`（改名）
- `src/components/FormattedDate.astro`

## ゴール
コードベースの一貫性を高める小さなリファクタリング。

## タスク
1. `rss.xml.js` を `rss.xml.ts` に改名し、TypeScript 化する。
   - `GET(context)` の `context` に Astro の `APIContext` 型を付与（`import type { APIContext } from 'astro'`）。
   - 既存ロジック（`getCollection('articles')` → `rss({...})`）は変更しない。出力 URL `/rss.xml` を維持。
2. `FormattedDate.astro` の `Intl.DateTimeFormat(undefined, ...)` のロケールを `'ja-JP'` に明示する。
   - サイトは `lang="ja"` / `og:locale=ja_JP` なので日付表記もそれに揃える。

## 完了条件
- `npm run build` を壊さない。`/rss.xml` が従来通り生成される。
- 旧 `rss.xml.js` は残さない（改名）。
