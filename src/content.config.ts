/**
 * コンテンツコレクション設定
 *
 * @overview 記事コレクションのスキーマ定義
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** 記事コレクション */
const articles = defineCollection({
	// src/content/articles/ ディレクトリからMarkdown/MDXを読み込む
	loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
	// frontmatterのスキーマ定義
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { articles };
