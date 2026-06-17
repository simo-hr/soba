# Goal: BaseLayout.astro の新規作成（HTML 骨格の共通化）

## 所有ファイル
- `src/layouts/BaseLayout.astro`（新規作成）

## ゴール
`index.astro` と `BlogPost.astro` が個別に持つ HTML 骨格（`<!doctype html><html lang="ja"><head><BaseHead/></head><body><Header/>...<Footer/></body></html>`）を 1 箇所に集約する共有レイアウトを作る。

## contract（凍結済み）
```ts
interface Props {
  title: string;
  description: string;
  image?: ImageMetadata; // BaseHead にそのまま渡す
}
```

## タスク
1. `BaseHead` / `Header` / `Footer` を import（シグネチャは現行のまま使用）。
2. 骨格を出力し、本文部分は `<slot />` で受ける。
   - `<head>` 内で追加スタイルを差し込めるよう、名前付きスロット `<slot name="head" />` を `</head>` 直前に置く（各ページ固有 `<style>` 用）。
3. `<main>` のラッピングは**各ページ側に委ねる**（index と BlogPost で `main`/`article` 構造とスタイルが異なるため）。BaseLayout は `<body><Header /><slot /><Footer /></body>` までを担当。

## 完了条件
- `<BaseLayout title=... description=...>` で骨格を再利用できる。
- 単体ビルドを壊さない（このゴール時点では未使用でも可。Phase 3 で各ページが利用する）。
