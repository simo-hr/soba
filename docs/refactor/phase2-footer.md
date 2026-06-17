# Goal: Footer.astro の重複排除と著者名の定数化

## 所有ファイル
- `src/components/Footer.astro`

## 依存（凍結済み contract）
- `src/components/SocialLinks.astro`（Phase 1）
- `src/consts.ts` の `SOCIAL_LINKS` と `AUTHOR_NAME`

## タスク
1. インラインの X / GitHub `<a>` + `<svg>` 群を `<SocialLinks />` に置き換える。
2. `.social-links` ラッパー（中央寄せ・gap・色）の **CSS は Footer に残す**（フッター固有の配置）。`<div class="social-links"><SocialLinks /></div>` の形にする。
3. コピーライトのハードコード `simo` を `AUTHOR_NAME`（`consts.ts`）に置き換える。`© {year} {AUTHOR_NAME}. All rights reserved.`
4. `today.getFullYear()` の取得ロジックは維持。

## 完了条件
- フッターの見た目・リンク先・著作権表記が現行と一致（`simo` は `AUTHOR_NAME` 由来）。
- `npm run build` を壊さない。
