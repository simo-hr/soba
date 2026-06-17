# Goal: consts.ts をソーシャルリンクの単一情報源にする

## 所有ファイル
- `src/consts.ts`

## ゴール
サイト全体で散在しているソーシャルリンク情報（X / GitHub の URL とアイコン情報）を `consts.ts` に集約し、単一情報源 `SOCIAL_LINKS` を定義する。

## 現状
- `TWITTER_ACCOUNT = '@hiro_nr825'` は存在するが、実際のリンク URL は `Header.astro` / `Footer.astro` に `https://x.com/hiro_nr825`、`https://github.com/simo-hr` とハードコードされている。

## タスク
1. 既存の定数（`SITE_TITLE` 等）は維持する。
2. `SOCIAL_LINKS` を定義する（**データ構造は設計判断: 別途人間が `TODO(human)` で実装**）。
   - `SocialLinks.astro` から反復され、各エントリにつき 1 つのアクセシブルなリンク + アイコンを描画できる形にする。
   - X と GitHub の 2 エントリ。URL は X=`https://x.com/hiro_nr825`、GitHub=`https://github.com/simo-hr`。
3. 型は TypeScript strict に適合させる（`as const` 等で適切に型付け）。

## 完了条件
- `SOCIAL_LINKS` が export され、`SocialLinks.astro` の contract（name/url/アクセシブルラベル + アイコン識別）を満たす。
- `npm run build` を壊さない。
