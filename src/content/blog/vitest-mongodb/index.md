---
title: "vitest + mongoDBのテスト環境を作った備忘録 [mongodb-memory-server]"
description: "テストで使用するMongoDBをどうするか悩んだ結果、mongodb-memory-serverを利用することにした。"
pubDate: "2023-08-05"
heroImage: "./images/Group-1-1.png"
---

## はじめに

テストで使用するMongoDBをどうするか悩んだ結果、mongodb-memory-serverを利用することにした。

mongodb-memory-serverはNode.jsのテスト環境での使用を目的としたパッケージで、メモリ上に一時的なMongoDBサーバを立ち上げることができる。わざわざ外部でmongoDBを準備をしなくても簡単にセットアップできる上に、メモリ上で動作するため実行速度が速い、クリーンアップが簡単などのメリットがある。

[https://github.com/nodkz/mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)

## 使い方

globaSetupでMongoDBを起動するようにしておく。

```
import { MongoMemoryServer } from 'mongodb-memory-server'

/**
 * メモリ上で動くMongoDBを起動する
 * テストの実行前に１度だけ実行される
 */
export async function setup() {
  // transactionを使う場合は、MongoMemoryReplSetを使う必要がある
  // const mongod = await MongoMemoryReplSet.create()
  const mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri('db-name')
  ;(global as any).MONGO_SERVER = mongod
  process.env.MONGO_URI = uri
}
```

teardownではmongoDBを停止する処理を行う。

teardownと言う関数名でexportするとvitestがテスト終了時に実行してくれる。

```
/**
 * メモリ上で動いているMongoDBを停止する
 * 全てのテストが終了した後に１度だけ実行される
 */
export async function teardown() {
  await (global as any).MONGO_SERVER.stop()
}
```

vitest.config.tsでそれぞれのファイルをglobalSetupに設定しておく。

```
export default defineConfig({
  test: {
    ...省略
    globalSetup: ['tests/globalSetup.ts', 'tests/teardown.ts'],
```

mongoDBとの連携を関数化しておく。

ここではmongooseを使用してmongoDBとの接続を行っている。

```
import mongoose from 'mongoose'

/**
 * DBに接続する
 */
export const dbConnect = async () => {
  mongoose.set('strictQuery', true)
  await mongoose.connect(process.env.MONGO_URI ?? '')
}

/**
 * DBのデータを全てクリアする
 */
export const dbClear = async () => {
  await mongoose.connection.db.dropDatabase()
}

/**
 * DBとの接続を切断する
 */
export const dbDisconnect = async () => {
  await mongoose.disconnect()
}
```

それぞれのテストから簡単に接続/切断できるようになった。

```
  beforeAll(async () => {
    await dbConnect()
    // 後の処理
  })
  afterAll(async () => {
    await dbClear()
    await dbDisconnect()
  })
```

## まとめ
