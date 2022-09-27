<template>
  <div :class="mobile?'container-mobile':'container'">
    <div class="player-container">
      <w-player :key="key" class="player" :options="options"></w-player>
    </div>
    <button class="toggle-btn" @click="toggle">{{`切换${mobile?'PC端':'移动端'}`}}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WPlayer } from '../packages';
import danmakuList from './danmaku.json';

const key = ref(0);
const mobile = ref(false);

const options = {
  resource: {
    360: {
      name: '标清',
      type: "mp4",
      url: 'http://upfile.myfz.fun/uploads%2F2022%2F09%2F24%2Fge4ZfU9g_137649199_u2-1-208.mp4'
    },
  },
  mobile: mobile.value,
  danmaku: {
    open: true,
    data: danmakuList
  }
}

const toggle = () => {
  mobile.value = !mobile.value;
  options.mobile = mobile.value;
  key.value = Date.now();
}
</script>

<style lang="less">
body {
  margin: 0;
  padding: 0;
  border: 0;
}

.container {
  width: 720px;
  margin: 20px auto;

  .player-container {
    height: 0;
    width: 100%;
    padding-bottom: 56.25%;
    position: relative;

    .player {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: black;
    }
  }
}

.container-mobile {
  width: 100%;

  .player-container {
    height: 0;
    width: 100%;
    padding-bottom: 56.25%;
    position: relative;

    .player {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: black;
    }
  }
}

.toggle-btn {
  width: 120px;
  height: 30px;
  color: #fff;
  border: none;
  margin: 60px 0;
  border-radius: 3px;
  background-color: #4b5cc4;

  &:hover {
    background-color: #6372d6;
  }
}
</style>
