---
title: "ブログをリニューアルした"
description: "WordPressで運用していたブログをAstroで作り直し、ホスティング先をAWS LightsailからCloudflare Workersに移行した。"
pubDate: "2026-01-30"
---

## はじめに

ブログをリニューアルした。
元々AWS Lightsail + WordPressで動かしてたが、イケてなさを感じていたので Cloudflare Worker + Astro の構成に変えた。
多分Cloudflare Pagesでもよかった。

## イケてなさを感じた理由

- 趣味でやってるブログなのに、Lightsailに月5ドルくらい払ってるのモッタイない
- WordPressのデザインに飽きた
- プラグインとか色々あるけど、よく分かってないし活用してない

## 移行手順の備忘録

ざっくりこんな流れで進めた。

1. WordPressの記事データをエクスポート
2. Astroでブログを作成し、記事をMarkdownに変換
3. Wranglerを使ってCloudflare Workersにデプロイ
4. 動作確認（この時点では`*.workers.dev`のURLでアクセス）
5. Cloudflareにドメインを追加し、ネームサーバーをRoute 53で変更
6. Workersにカスタムドメインを設定
7. 旧Lightsailインスタンスを停止

ドメインはRoute 53で取得していて、DNSをCloudflareに移行する必要があったが、Cloudflareに案内されるがままにポチポチしたらすぐ終わって感動した。

## 最後に
シンプルな見た目になってスッキリした。ただサムネとかアイコンがなくなって寂しいので、いい感じにしていきたい。
月5ドル浮くようになって嬉しい。
