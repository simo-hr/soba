# Goal: Header.astro のソーシャルリンク重複排除

## 所有ファイル
- `src/components/Header.astro`

## 依存（凍結済み contract）
- `src/components/SocialLinks.astro`（Phase 1 で作成）
- `src/consts.ts` の `SOCIAL_LINKS`（Phase 1）

## タスク
1. インラインの X / GitHub `<a>` + `<svg>` 群を `<SocialLinks />` に置き換える。
2. `.social-links` ラッパー（`display: flex` とモバイルで `display: none` にする `@media`）の **CSS は Header に残す**（配置はヘッダー固有）。`<div class="social-links"><SocialLinks /></div>` の形にする。
3. ナビゲーション（`Articles` / `About` リンク、サイトタイトル）と既存スタイルは維持。

## 完了条件
- ヘッダーの見た目・リンク先が現行と一致。
- `npm run build` を壊さない。
