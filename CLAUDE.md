# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Astro 5ベースの日本語技術ブログです。Markdown/MDX記事をコンテンツコレクションで管理し、静的サイトとして生成します。

## 開発コマンド

```bash
# 開発サーバーを起動 (localhost:4321)
npm run dev

# 本番ビルド (./dist/ に生成)
npm run build

# ビルドしたサイトをローカルでプレビュー
npm run preview

# TypeScript型チェック（.astroファイルを含む）
npm run astro -- check

# Astro CLIコマンドを実行
npm run astro -- [command]
```

## デプロイ

Cloudflare Workers（静的アセット配信）にデプロイ。`wrangler.jsonc` で設定済み。

```bash
# デプロイ（要: Wrangler CLI）
npx wrangler deploy
```

`npm run build` で生成した `./dist/` ディレクトリを Cloudflare が配信する。

## コードベース構成

### コンテンツコレクション

記事は `src/content/articles/` 内に各記事ごとのディレクトリで管理:

```
src/content/articles/
├── article-slug/
│   ├── index.md (または index.mdx)
│   └── images/
│       └── *.png
```

- **スキーマ定義**: `src/content.config.ts` でzodスキーマを定義
- **必須frontmatter**: `title`, `description`, `pubDate`
- **オプション**: `updatedDate`
- **コレクション取得**: `getCollection('articles')` で全記事を取得
- **記事ID**: ディレクトリ名がslugとして自動的に記事IDになる（例: `git-prune/` → `post.id = "git-prune"`）

### ルーティング

- **トップページ** (`src/pages/index.astro`): 記事一覧を公開日降順で表示
- **記事詳細** (`src/pages/articles/[...slug].astro`): 動的ルートで `/articles/記事ID/` にアクセス可能
- **aboutページ** (`src/pages/about.astro`): サイト情報ページ

### グローバル定数

`src/consts.ts` でサイト全体の設定値を管理:

- `SITE_TITLE`: サイトタイトル
- `SITE_DESCRIPTION`: サイト説明
- `SITE_URL`: サイトURL
- `TWITTER_ACCOUNT`: Twitterアカウント
- `AUTHOR_NAME`: 著者名

これらの定数は、メタタグ、OGP、JSON-LD構造化データなどで使用されます。

### レイアウトとコンポーネント

- **BlogPost** (`src/layouts/BlogPost.astro`): 記事詳細ページのレイアウト。タイトル、公開日、更新日を表示し、本文は `<slot />` で挿入
- **BaseHead** (`src/components/BaseHead.astro`):
  - メタタグ、OGP、Twitterカードを設定
  - JSON-LD構造化データを含む
  - グローバルCSSをインポート
- **Header** / **Footer**: ヘッダーとフッターコンポーネント
- **FormattedDate**: 日付フォーマット用コンポーネント

### シンタックスハイライト

- **エンジン**: Shiki（デフォルトの`github-dark`テーマ）
- **記法**: コードブロックに言語指定（\`\`\`typescript, \`\`\`bash など）を追加すると自動でハイライト

### スタイリング

- グローバルスタイル: `src/styles/global.css`
- コンポーネントスコープCSS: 各`.astro`ファイル内の`<style>`タグ
- 記事本文の見出しサイズは `global.css` の要素セレクタ（`h1`〜`h6`）で定義（h1: 2em, h2: 1.5em, h3: 1.25em, ...）
- 注意: Astroのスコープ付き`<style>`は`<slot />`経由で挿入されるMarkdownの要素には届かない（`data-astro-cid-*`属性が付かないため）。記事本文にスタイルを当てる場合は`is:global`が必要

## 記事作成ワークフロー

1. `src/content/articles/` に新しいディレクトリを作成（ディレクトリ名がslugになる）
2. ディレクトリ内に `index.md` を作成し、frontmatterを記述:
   ```markdown
   ---
   title: "記事タイトル"
   description: "記事の説明"
   pubDate: "YYYY-MM-DD"
   updatedDate: "YYYY-MM-DD" # オプション
   ---
   ```
3. 本文を記述（Markdown/MDX）
4. コードブロックには言語指定を追加（\`\`\`typescript など）
5. 画像は同じディレクトリ内の `images/` サブディレクトリに配置し、相対パスで参照

## SEO対策

- **sitemap**: `@astrojs/sitemap` インテグレーションで自動生成
- **RSS**: `/rss.xml` で配信
- **OGP/Twitterカード**: `BaseHead.astro` で設定
- **JSON-LD構造化データ**: Blogスキーマを実装済み
- **canonical URL**: 各ページで設定済み
- **robots.txt**: プロジェクトルートに配置

## その他

- **TypeScript**: 型チェックは `tsconfig.json` で設定
- **画像最適化**: sharpを使用（依存関係に含まれる）
- **フォント**: Atkinson Regular/Bold をプリロード
