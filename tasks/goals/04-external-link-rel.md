# T4: 外部リンクに rel 属性を付与

## ゴール

`target="_blank"` の外部リンクに `rel="noopener noreferrer"` を付ける。

## 背景

`src/components/Header.astro` の SNS リンク2箇所が `target="_blank"` のみで開いている。

- `Header.astro:14` — X (Twitter) へのリンク
- `Header.astro:23` — GitHub へのリンク

モダンブラウザは `target="_blank"` に対して暗黙的に `noopener` を適用するため
実害は小さいが、以下の理由で明示する価値がある。

- `noreferrer` は暗黙適用の対象外で、Referer ヘッダの送出を止められる
- 意図が明示され、レビュー時に「付け忘れ」と区別できる

## 作業内容

`src/components/Header.astro` の2箇所の `<a>` タグに `rel="noopener noreferrer"` を追加する。

```html
<a href="https://x.com/hiro_nr825" target="_blank" rel="noopener noreferrer">
```

## やらないこと

- SVG アイコンの markup、`sr-only` の文言、スタイルには触らない
- `Footer.astro` に外部リンクがある場合も、このタスクの範囲外とする
  （見つけた場合は報告のみ）

## 完了条件

```bash
# 1. target="_blank" と rel の数が一致すること
grep -c 'target="_blank"' src/components/Header.astro   # 期待値: 2
grep -c 'rel="noopener noreferrer"' src/components/Header.astro  # 期待値: 2

# 2. ビルドが通ること
npm run build
```
