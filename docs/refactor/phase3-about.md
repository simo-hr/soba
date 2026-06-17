# Goal: about.astro のレイアウト適正化

## 所有ファイル
- `src/pages/about.astro`

## 依存（凍結済み contract）
- `src/layouts/BaseLayout.astro`（Phase 2）

## 現状の問題
- `about.astro` が記事用 `BlogPost.astro` を流用し、`pubDate={new Date('2023-05-01')}` というダミー日付を渡して About ページに不要な日付を表示している。

## タスク
1. `BlogPost`（記事用）ではなく `BaseLayout` を直接使う構成に変更する。
2. About 本文（`<h2>simo</h2>` 等の自己紹介）を `.prose` 相当の中央寄せコンテナで包んで読みやすさを維持する。
   - 記事本文と同等の幅・余白にしたい場合、`.prose` スタイルを about 側ローカル `<style slot="head">` で持つか、共通化を最小限に留める。
3. ダミー `pubDate` と日付表示を排除する。
4. `title="About"`, `description="simoの自己紹介"` は維持。

## 完了条件
- About ページに不要な日付が表示されない。本文の体裁は崩れない。
- `npm run build` を壊さない。
