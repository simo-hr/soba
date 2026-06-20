import { SITE_TITLE, SITE_URL, SITE_DESCRIPTION, AUTHOR_NAME } from '../consts';

/**
 * Blog スキーマ（schema.org）の JSON-LD オブジェクトを返す純粋関数。
 * 出力内容は BaseHead.astro 内のインライン JSON-LD と完全に同一。
 */
export function buildBlogJsonLd(): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: SITE_TITLE,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		author: {
			'@type': 'Person',
			name: AUTHOR_NAME,
			url: SITE_URL,
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_TITLE,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/favicon.ico`,
			},
		},
	};
}
