# vue-wplayer 弹幕视频播放器

## 安装
```
npm install vue-wplayer
```

## 示例
```vue
<template>
  <div class="container">
    <div class="player-container">
      <w-player class="player" ></w-player>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WPlayer from 'vue-wplayer';
import 'vue-wplayer/dist/style.css';

export default defineComponent({
  components: {
    WPlayer
  }
})
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
|resource|string 或 []|视频资源|-|
|type|string|视频类型|'mp4'|
|mobile|bool|是否为移动端|false|
|theme|string|主题色|'#18a058'|
|playbackSpeed|[]| 播放速度|[0.5, 0.75, 1, 1.5, 2]|
|danmaku.open|bool|是否开启弹幕|false|
|danmaku.placeholder|string|弹幕输入提示|'在这里输入弹幕哦~'|
|danmaku.data|[]|弹幕数据|-|
|danmaku.send|function|发送弹幕回调函数|-|

