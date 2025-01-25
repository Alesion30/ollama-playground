# ollama playground

## セットアップ

```sh
npm install
```

### [補足] direnvでNodeバージョンを指定する

direnvのセットアップが完了していない場合は、 https://direnv.net/ を参考する。

`.envrc.local` を作成する。以下は、[mise](https://mise.jdx.dev/)のNodeのバージョンを指定する場合である。

```sh
export MISE_NODE_VERSION=$(jq -r .engines.node ./package.json)
```

## 実行

```sh
node src/main.ts
```

## カスタムモデルの利用

```sh
ollama create mario -f ./models/mario/Modelfile
ollama list
```
