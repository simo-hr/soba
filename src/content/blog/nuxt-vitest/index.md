---
title: "vitestでNuxt3のコンポーネントテスト環境を作った備忘録"
description: "Nuxt3のプロジェクトでvitestを使ったコンポーネントテスト環境を実装した備忘録。Nuxt3\\*vitestはまだまだ開発中といった状況で情報も少なくできないことも多いので随時アップデートしていきたい。"
pubDate: "2023-06-10"
heroImage: "./images/download-e1686469775202.png"
---

## はじめに

Nuxt3のプロジェクトでvitestを使ったコンポーネントテスト環境を実装した備忘録。Nuxt3\*vitestはまだまだ開発中といった状況で情報も少なくできないことも多いので随時アップデートしていきたい。

## 使用したライブラリ

### vitest

Viteベースの高速なテストランナー  
https://github.com/vitest-dev/vitest

### @testing-library/vue

Vue.jsアプリケーション向けのシンプルなテストユーティリティを提供し、DOMに対する操作やアサーションを行う。  
https://github.com/testing-library/vue-testing-library

### nuxt-vitest

Nuxtでvitestを使用するためのモジュール。  
https://github.com/danielroe/nuxt-vitest

### happy-dom

高速な仮想DOM実装で、ブラウザ環境をシミュレートする。  
https://github.com/capricorn86/happy-dom

### @vitest/coverage-c8は

vitestでコードカバレッジを収集するためのプラグイン。

## テストの設定

```
import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  test: {
    globals: true,
    globalSetup: 'tests/setup.ts',
    environment: 'happy-dom',
    coverage: {
      provider: 'c8',
      include: ['components/**/*.{vue}', 'composables/**/*.{js,ts}', 'pages/**/*.{vue}', 'utils/**/*.{js,ts}'],
      exclude: [],
      all: true,
    },
  },
  resolve: {
    alias: {},
  },
})
```

## 非同期setup関数への対応

setup関数が非同期で定義されている（トップレベルでawaitを使ってる）場合は解決前に描画され要素が見つからないとエラーが出る。テスト対象のコンポーネントを`Suspend`でラップすることで回避できるが、コンポーネントによってはなぜかうまくいかない。その場合はawaitを使っている箇所を`onBeforeMount`内で処理するようにコンポーネント側を修正する。（[https://test-utils.vuejs.org/guide/advanced/async-suspense.html#testing-asynchronous-setup](https://test-utils.vuejs.org/guide/advanced/async-suspense.html#testing-asynchronous-setup)）

※SuspendはVue公式が実験的な機能と言っている。また、nuxt-vitestのドキュメントにTODOとしてmountSuspendedの記載があったので今後サポートされるかも。

### Nuxt環境が必要なテスト

useState等のnuxtの固有の機能を使用しているとテスト実行時に未定義エラーがでるので、本来はモックが必要になる。しかし、テストのファイル名に`hoge.nuxt.test.ts`のように`.nuxt`を入れると、Nuxt環境でテストが実行されuseState等が使える状態でテストが走る。  
ファイル名に.nuxtを追加する代わりにをテストファイルに`@vitest-environment nuxt`とコメントを追加することで同じことができる。

### 追記

2023/06/06  
`happy-dom`を使用すると'@nuxt/test-utils'のsetup関数で `[sass] render is not a function`エラーが発生する。`jsdom`に変更すると回避できる。
