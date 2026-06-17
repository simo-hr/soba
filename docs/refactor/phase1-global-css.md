# Goal: global.css の整理（見出し定義の一元化・デッドコード除去）

## 所有ファイル
- `src/styles/global.css`

## ゴール
グローバルスタイルを整理し、見出しサイズの単一情報源とする。`BlogPost.astro` 側の `!important` 上書きを不要にするための土台を作る。

## タスク
1. 見出し（h1〜h6）サイズは `global.css` を唯一の定義元とする。現行値（h1:2em, h2:1.5em, h3:1.25em, h4:1.1em, h5:1em）を維持。
2. コメントアウトされたデッドコード（`/* p { ... } */`、`/* .prose p { ... } */`）を削除。
3. 記事本文（`.prose`）の見出し用 `margin-top` / `margin-bottom` 調整を、`BlogPost.astro` から `global.css` の `.prose h2/h3/h4/h5/h6` ルールへ移管する（`!important` 無しで成立するように）。
   - 移管する値は `BlogPost.astro` 現行の prose 見出しマージン（h2: top 2em/bottom .75em, h3: 1.5em/.5em, h4: 1.25em/.5em, h5,h6: 1em/.5em）。
4. 既存の他ルール（body, code, blockquote, sr-only 等）は維持。

## 注意
- `BlogPost.astro` 本体の編集は `phase3-blogpost.md` 側が担当する。本ゴールは `global.css` に prose 見出しルールを**用意する**ところまで。両者は別ファイルなので並列で安全。

## 完了条件
- `npm run build` を壊さない。見出しの見た目が現行と一致。
