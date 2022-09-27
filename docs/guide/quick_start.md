# 快速开始

## 安装


```shell
#使用npm安装
npm install vue-wplayer
#使用yarn安装
yarn add vue-wplayer
```

## 引入 vue-wplayer
#### 全局引入
在 main.js 中写入以下内容：
```js
import { createApp } from 'vue'
import App from './App.vue'
import WPlayer from 'vue-wplayer';
import 'vue-wplayer/dist/style.css';

createApp(App).use(WPlayer).mount("#app");
```

#### 局部引入

在需要引入播放器的组件或页面内加入以下内容：
```js
import { WPlayer } from 'vue-wplayer';
import 'vue-wplayer/dist/style.css';
```

## 使用
在 `template` 加入
```vue
<template>
  <w-player :options="options"></w-player>
</template>
```
播放器接收一个 `options` prop。通过修改 `options` 可以自定义播放器，详情请查看 [参数](parameters)。


## 完整示例
```vue
<template>
  <w-player class="player" :options="options"></w-player>
</template>

<script setup lang="ts">
import { WPlayer } from 'vue-wplayer';
import 'vue-wplayer/dist/style.css';

const options = {
  resource: "视频链接",
}
</script>

<style >
.player {
  width: 720px;
  height: 396px;
}
</style>
```