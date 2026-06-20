/**
 * RSSフィード生成
 *
 * @overview 記事のRSSフィードを生成する
 */
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';

export async function GET(context: APIContext) {
	const posts = await getCollection('articles');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		// astro.config の site が設定済みなら context.site を使い、念のため SITE_URL をフォールバック
		site: context.site ?? SITE_URL,
		items: posts.map((post) => ({
			...post.data,
			link: `/articles/${post.id}/`,
		})),
	});
}
