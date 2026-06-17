# プロダクトコード リファクタリング計画（概要）

Astro 5 ブログのプロダクトコード（記事コンテンツを除く）を、重複排除・責務分離・単一情報源化の観点でリファクタリングする。

## 現状の課題

1. **ソーシャルリンクの重複** — `Header.astro` / `Footer.astro` が X/GitHub の SVG とリンク markup を丸ごと重複。URL がハードコードで `consts.ts` と二重管理。
2. **レイアウト骨格の重複** — `index.astro` / `BlogPost.astro` が HTML 骨格（`html/head/body/Header/Footer`）をそれぞれ全部書いている。共有レイアウトが無い。
3. **CSS の衝突** — 見出しサイズが `global.css` と `BlogPost.astro` で二重定義され `!important` で上書き。デッドコメントも残存。
4. **一貫性の欠如** — `rss.xml.js` だけ JS、`FormattedDate` のロケールが `undefined`、`about.astro` が記事用レイアウトを流用し不要な日付を表示。
5. **BaseHead の肥大** — インライン JSON-LD などが本体に混在。

## 凍結された共有インターフェース（contract）

並列実装の前提。各エージェントはこの契約に対してコードを書く。

- `consts.ts` が**ソーシャルリンクの単一情報源** `SOCIAL_LINKS` を提供する（構造は Phase 1 で確定）。
- `SocialLinks.astro` は `SOCIAL_LINKS` を反復し、アクセシブルなリンク + アイコンを描画する再利用コンポーネント。Header/Footer の両方から使われる。
- `BaseLayout.astro` は `Props { title: string; description: string; image?: ImageMetadata }` を受け取り、`<html><head><BaseHead/></head><body><Header/><slot/><Footer/></body></html>` の骨格を所有する。

## フェーズと並列化マップ

各フェーズ内のタスクは**並列実行**（Sonnet エージェントに各ゴールファイルを渡す）。フェーズ間は順次。

### Phase 1: 基盤（互いに素・並列）
| ゴールファイル | 所有ファイル | 依存 |
| --- | --- | --- |
| `phase1-consts.md` | `src/consts.ts` | なし（contract の起点） |
| `phase1-social-links.md` | `src/components/SocialLinks.astro`（新規） | consts contract |
| `phase1-global-css.md` | `src/styles/global.css` | なし |
| `phase1-polish.md` | `src/pages/rss.xml.ts`（改名）, `src/components/FormattedDate.astro` | なし |

### Phase 2: 共有コンポーネント / レイアウト（並列）
| ゴールファイル | 所有ファイル | 依存 |
| --- | --- | --- |
| `phase2-header.md` | `src/components/Header.astro` | SocialLinks, consts |
| `phase2-footer.md` | `src/components/Footer.astro` | SocialLinks, consts |
| `phase2-basehead.md` | `src/components/BaseHead.astro` | consts |
| `phase2-base-layout.md` | `src/layouts/BaseLayout.astro`（新規） | Header/Footer/BaseHead（シグネチャ不変） |

### Phase 3: ページ（並列）
| ゴールファイル | 所有ファイル | 依存 |
| --- | --- | --- |
| `phase3-index.md` | `src/pages/index.astro` | BaseLayout |
| `phase3-blogpost.md` | `src/layouts/BlogPost.astro` | BaseLayout |
| `phase3-about.md` | `src/pages/about.astro` | BaseLayout / BlogPost |

### Phase 4: 検証（順次・Opus）
- `npm run build` が成功すること。生成 HTML の差分が意図通りか確認。

## 制約（全エージェント共通）

- 既存の**見た目・出力 HTML を極力維持**（純粋なリファクタリング）。挙動変更は最小限。
- frontmatter スキーマ / 記事コンテンツ / `astro.config.mjs` の `site` は変更しない。
- 日本語コメントのスタイル（JSDoc 風 `@overview` など）を踏襲。
- 各ファイルは TypeScript strict に適合させる。
