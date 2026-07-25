/**
 * RSSフィード生成
 *
 * @overview 記事のRSSフィードを生成する
 */
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../consts';

export async function GET(context: APIContext) {
	const posts = await getCollection('articles');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site ?? SITE_URL,
		items: posts.map((post) => ({
			...post.data,
			link: `/articles/${post.id}/`,
		})),
	});
}
