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
 *   data（リンク情報）と表現（SVG markup）を分離するため、ここでは識別子のみを持ち、
 *   アイコン SVG は SocialLinks.astro 側で `name` に応じて出し分ける。
 * @remarks `as const` により `name` は 'x' | 'github' のリテラル型に固定される。
 */
export const SOCIAL_LINKS = [
	{ name: 'x', url: 'https://x.com/hiro_nr825', label: 'Follow on X' },
	{ name: 'github', url: 'https://github.com/simo-hr', label: 'GitHub' },
] as const;

/** ソーシャルリンク1件の型 */
export type SocialLink = (typeof SOCIAL_LINKS)[number];
