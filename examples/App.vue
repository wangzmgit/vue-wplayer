<template>
  <div :class="mobile?'container-mobile':'container'">
    <div class="player-container">
      <w-player class="player" :options="options"></w-player>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WPlayer } from '../packages';
import danmakuList from './danmaku.json';

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
</style>
