# vue-wplayer 弹幕视频播放器
![NPM](https://img.shields.io/npm/l/vue-wplayer)
![npm](https://img.shields.io/npm/v/vue-wplayer?logo=npm)

## 文档
示例: http://wplayer.kuukaa.fun/examples

文档: http://wplayer.kuukaa.fun/guide/quick_start.html


## 安装
```
npm install vue-wplayer
```

## 示例
```js
<template>
  <div class="container">
    <div class="player-container">
      <w-player class="player" :options="options"></w-player>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WPlayer } from 'vue-wplayer';
import 'vue-wplayer/dist/style.css';


const options = {
  resource: "视频链接",
}
</script>

<style>
.container {
  width: 720px;
}

.player-container {
  height: 0;
  width: 100%;
  padding-bottom: 56.25%;
  position: relative;

}

.player {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: black;
}
</style>
```

## 参数
|内容|类型|描述|默认值|
|:-----|:-----|:-----|:-----|
|resource|string 或 不同清晰度信息对象|视频资源|-|
|type|string|视频类型|'mp4'|
|blob|bool|mp4是否开启blob|false|
|mobile|bool|是否为移动端|false|
|theme|string|主题色|'#4b5cc4'|
|playbackSpeed|[]| 播放速度|[0.5, 0.75, 1, 1.5, 2]|
|danmaku.open|bool|是否开启弹幕|false|
|danmaku.placeholder|string|弹幕输入提示|'在这里输入弹幕哦~'|
|danmaku.data|[]|弹幕数据|-|
|danmaku.send|function|发送弹幕回调函数|-|

