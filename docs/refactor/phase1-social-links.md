# Goal: SocialLinks 共有コンポーネントの新規作成

## 所有ファイル
- `src/components/SocialLinks.astro`（新規作成）

## ゴール
Header / Footer に重複している X・GitHub のソーシャルリンク markup（SVG アイコン含む）を 1 つの再利用コンポーネントに集約する。

## contract（凍結済み）
- `consts.ts` の `SOCIAL_LINKS` を import して反復描画する。
- 各リンクは新規タブで開き（`target="_blank"` + `rel="noopener noreferrer"`）、スクリーンリーダー向けに `<span class="sr-only">` ラベルを持つ（既存実装踏襲）。
- アイコン SVG は X と GitHub の現行パスを保持する（`Header.astro` / `Footer.astro` の `<svg>` をそのまま流用）。`SOCIAL_LINKS` の識別子（name 等）でアイコンを出し分ける。
- Header と Footer で配置・色が異なるため、外側のラッパー（`.social-links`）のスタイルは**各呼び出し側に任せ**、このコンポーネントは `<a>` 群のみを出力する設計が望ましい（`<slot>` 不要）。色は `currentColor` を維持し、呼び出し側の color を継承させる。

## 参照（現行の SVG パス）
- X: `Header.astro` / `Footer.astro` 内の `viewBox="0 0 24 24"` の path
- GitHub: 同 `viewBox="0 0 16 16"` の path

## 完了条件
- `<SocialLinks />` を Header/Footer から差し込めば、現行と同じアイコン・リンクが描画される。
- `npm run build` を壊さない。
