# T1: デッドCSSの除去

## ゴール

効いていないCSSルールを削除し、`!important` を正当な1箇所のみに減らす。
**見た目は1pxも変えない。**

## 背景（必読）

`BlogPost.astro` の `.prose h2`〜`.prose h6` は、Astro のスコープCSSによって
`.prose[data-astro-cid-xxx] h2[data-astro-cid-xxx]` に変換される。
しかし `<slot />` 経由で挿入される Markdown の見出しには `data-astro-cid-*` 属性が付かないため、
**これらのセレクタは一度もマッチしていない**。

実際に記事の見出しサイズを決めているのは `src/styles/global.css:62-76` の素の要素セレクタで、
値が偶然一致しているため見た目の破綻として表面化していなかった。

したがってこれらは「詳細度を調整する」対象ではなく「削除する」対象である。

## 作業内容

### 1. `src/layouts/BlogPost.astro`

以下のブロックを**丸ごと削除**する（コメント行 `/* 記事本文内の見出しサイズ調整... */` を含む）。

- `.prose h2 { ... }`
- `.prose h3 { ... }`
- `.prose h4 { ... }`
- `.prose h5, .prose h6 { ... }`

さらに `.title h1` の `font-size: 2em !important;` から `!important` を削除する。
`global.css` の `h1 { font-size: 2em }` と同値なので、宣言自体を消しても表示は変わらない。
ただし `.title h1` には `margin` と `line-height` の指定が残るため、**ルール自体は残し、
`font-size` の行のみ削除する**こと。

### 2. `CLAUDE.md`

「スタイリング」セクションの以下の記述は事実に反するため修正する。

> 記事本文の見出しサイズは `BlogPost.astro` で調整済み（h1: 2em, h2: 1.5em, h3: 1.25em, ...）

正しくは「記事本文の見出しサイズは `global.css` の要素セレクタで定義」である。
あわせて「`<slot />` 経由の Markdown にはスコープCSSが届かないため、
記事本文にスタイルを当てる場合は `is:global` が必要」という注意書きを1行加えること。

## やらないこと

- `src/styles/global.css:158` の `.sr-only { position: absolute !important }` は
  **正当な用途**（スクリーンリーダー用の指定が上書きされると事故になる）。**触らない**。
- CSSカスケードレイヤー（`@layer`）の導入はしない。デッドコードを消すだけで目的は達成される。
- 見出しの余白（`margin-top: 2em` 等）を `is:global` で有効化することは**しない**。
  現状維持が方針として決定済み。

## 完了条件

```bash
# 1. .prose の !important が消えていること（期待値: 1 = .sr-only のみ）
grep -rc "!important" src/ | grep -v ":0"

# 2. ビルドが通ること（11ページ）
npm run build

# 3. 型チェックが通ること
npm run astro -- check

# 4. 生成HTMLが変更前と一致すること（見た目の非退行）
#    ※ 作業前に cp -r dist /tmp/dist-before を実行しておくこと
diff -r /tmp/dist-before dist
```

`diff` の結果、CSSのハッシュ名やスタイル定義の差分は出るが、
**記事本文の h2〜h6 に適用される font-size が変わっていないこと**を確認する。
