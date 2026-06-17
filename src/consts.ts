/**
 * サイト全体で使用するグローバル定数
 *
 * @description サイト全体で共有される設定値を定義
 * @limitations なし
 */

/** サイトタイトル */
export const SITE_TITLE = 'simo blog';

/** サイト説明文 */
export const SITE_DESCRIPTION = '個人ブログ';

/** サイトURL */
export const SITE_URL = 'https://simo-blog.com';

/** Twitter/Xアカウント */
export const TWITTER_ACCOUNT = '@hiro_nr825';

/** 著者名 */
export const AUTHOR_NAME = 'simo';

/**
 * ソーシャルリンクの単一情報源
 *
 * @description Header / Footer の SocialLinks コンポーネントから反復描画される。
 *   現状ハードコードされている URL: X = https://x.com/hiro_nr825 , GitHub = https://github.com/simo-hr
 * @remarks SocialLinks.astro は、各エントリにつき新規タブで開くアクセシブルなリンク
 *   （sr-only ラベル付き）と、エントリごとに対応する SVG アイコンを描画する。
 */
// TODO(human): SOCIAL_LINKS を定義する。
//   各エントリに必要なフィールドを設計し、X と GitHub の 2 件を記述してください。
//   - SocialLinks.astro がアイコンを出し分けられる識別子
//   - リンク先 URL
//   - スクリーンリーダー用のアクセシブルなラベル
//   型安全のため `as const` 等を活用してください。
