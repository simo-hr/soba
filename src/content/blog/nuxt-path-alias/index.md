---
title: "nuxt.config.tsでパスエイリアスを利用すると'Cannot find module'エラーが出てしまう原因"
description: "nuxt3プロジェクトのnuxt.config.tsでhooksを設定するために、hooksを定義したモジュールをimportとしようと以下のように記述したところエラーが出た。"
pubDate: "2023-09-17"
heroImage: "./images/download-e1686469775202.png"
---

## 起こったこと

nuxt3プロジェクトのnuxt.config.tsでhooksを設定するために、hooksを定義したモジュールをimportとしようと以下のように記述したところエラーが出た。

```
import hooks from '~/server/hooks'

export default defineNuxtConfig({
  // ...省略
  hooks,
})
```

```
$ yarn build
 ERROR  Cannot find module '~/server/hooks' 
```

モジュールがありませんよと怒られたので、試しに相対パスを使って`import hooks from './server/hooks'` と記述するとエラーは起きなかった。

## 疑問に思ったこと

相対パスを使えばエラーが出ないことは分かったが、そもそもnuxtは**~**を含むいくつかのパスエイリアスをデフォルトで使えるように設定してくれているはず。（[https://nuxt.com/docs/api/configuration/nuxt-config](https://nuxt.com/docs/api/configuration/nuxt-config)）

他のtsやvueファイルでは問題なく使用できているので、なぜnuxt.config.tsだけ使えないのか？

## 辿り着いた答え

nuxtリポジトリの以下のissueを見ると、原因が分かった。

[https://github.com/nuxt/nuxt/issues/13728](https://github.com/nuxt/nuxt/issues/13728)

簡単にまとめてみると、どうやらnuxt.config.tsはNuxtが起動する前にロードされるが、この段階では、パスエイリアスを解決するツールが完全に動作しておらずエラーが出てしまうようだ。

## 最後に

相対パスを使えば解決する話ではあるが、nuxt.config.tsがimportするモジュール内でパスエイリアスを使っていても勿論エラーになり、他のモジュールまで書き直す必要があるので結構めんどくさい。

こういうエラーが出ると普段は意識しづらいライブラリの中の動きを知る機会になったりするので、勉強にはなった。
