<template>
  <div :class="mobile?'container-mobile':'container'">
    <div class="player-container">
      <!-- <div class="player"></div> -->
      <w-player class="player" :options="options"></w-player>
    </div>
  </div>
</template>

<script lang="ts">
import WPlayer from '../packages';
import { defineComponent, ref } from 'vue';


export default defineComponent({
  setup() {
    // const hls = ref<Hls | null>(null);
    const mobile = ref(false);
    const options = {
      resource: {
        360: {
          name: '标清',
          type: "mp4",
          url: 'http://localhost:9000/api/video/danmu.mp4'
        },
        720: {
          name: '超清',
          url: 'http://localhost:9000/api/video/1657875486715209400414533/original.m3u8'
        }
      },
      type: 'hls',
      mobile: mobile.value,
      // customType: function (player: HTMLVideoElement, url: string) {
      //   hls.value = new Hls()
      //   hls.value.loadSource(url);
      //   hls.value.attachMedia(player);
      //   hls.value.on(Hls.Events.ERROR, () => {
      //     console.error("资源加载失败");
      //   });
      // },
      theme: 'pink',
      danmaku: {
        open: true,
        //主题
        data: [
          {
            type: 0,
            time: 1,
            color: '#fff',
            text: '123'
          },
          {
            type: 0,
            time: 1,
            color: '#fff',
            text: '666'
          },
          {
            type: 0,
            time: 1,
            color: '#fff',
            text: '查电费功夫大师'
          },
          {
            type: 0,
            time: 1,
            color: '#fff',
            text: '山东分公司'
          },
          {
            type: 0,
            time: 1,
            color: '#fff',
            text: '大风蚀高地好几个地方的说法'
          },
          {
            type: 0,
            time: 1,
            color: '#fff',
            text: '电饭锅和价格会发给对方的水电费'
          },
          {
            type: 0,
            time: 2,
            color: '#fff',
            text: '123456'
          },
          {
            type: 0,
            time: 2,
            color: '#fff',
            text: '123'
          },
        ]
      }
    }

    return {
      options,
      mobile
    }
  },
  components: {
    WPlayer
  }
})

</script>

<style lang="less">

body{
	margin: 0; 
	padding: 0;
	border: 0;
}

.container {
  width: 720px;

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
