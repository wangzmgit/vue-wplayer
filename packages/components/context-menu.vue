<template>
  <div id="menu" v-show="showMenu" class="wplayer-menu-box">
    <ul class="menu-list">
      <li class="menu-item" @click="videoMirror()">
        <span>镜像</span>
      </li>
      <li class="menu-item" @mouseover="showExplain = true" @mouseleave="showExplain = false">
        <span>快捷键说明</span>
      </li>
      <li class="menu-item">
        <span>{{ resolution }}</span>
      </li>
      <li class="menu-item">
        <span>版本:{{config.version}}</span>
      </li>
    </ul>
  </div>
  <div v-show="showExplain" class="wplayer-shortcut-key">
    <p>快捷键说明</p>
    <tr>
      <td>Space</td>
      <td>播放/暂停</td>
    </tr>
    <tr>
      <td>鼠标双击</td>
      <td>播放/暂停</td>
    </tr>
    <tr>
      <td>ESC</td>
      <td>退出全屏</td>
    </tr>
    <tr>
      <td>←/→</td>
      <td>前进/后退10秒</td>
    </tr>
    <tr>
      <td>Ctrl+m</td>
      <td>镜像播放</td>
    </tr>
  </div>
</template>

<script lang="ts">
import config from '../../package.json';
import { ref, defineComponent } from 'vue';

export default defineComponent({
  emits: ['mirror'],
  setup(_props, ctx) {
    const showMenu = ref(false);//是否显示菜单
    const showExplain = ref(false);//显示快捷键说明
    const resolution = ref("unknown");//分辨率

    //开启右键菜单
    const open = (e: any, video: HTMLVideoElement) => {
      let menu = document.getElementById("menu");
      menu!.style.left = e.offsetX + "px";
      menu!.style.top = e.offsetY + "px";
      resolution.value = `${video.videoWidth} X ${video.videoHeight}`
      showMenu.value = true;
    }

    //关闭右键菜单
    const close = () => {
      showMenu.value = false;
    }

    //镜像翻转
    const videoMirror = () => {
      ctx.emit('mirror');
    }

    //menu是否开启
    const menuIsShow = () => {
      return showMenu.value;
    }

    return {
      config,
      showMenu,
      resolution,
      showExplain,
      open,
      close,
      menuIsShow,
      videoMirror,
    }
  }
});
</script>

<style lang="less">
.wplayer-menu-box {
  position: absolute;
  width: 120px;
  z-index: 30;
  background: rgba(12, 12, 12, 0.6);

  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .menu-item {
      color: #fff;
      line-height: 22px;
      font-size: 12px;
      text-align: center;
      padding: 6px 0;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

.wplayer-shortcut-key {
  color: #fff;
  position: absolute;
  width: 260px;
  font-size: 12px;
  margin: 20px 10px;
  padding-bottom: 6px;
  background: rgba(12, 12, 12, 0.6);

  p {
    margin: 6px 10px;
  }

  tr {

    width: 260px;

    td:nth-child(1) {
      width: 130px;
      text-align: center;
    }

    td:nth-child(2) {
      width: 130px;
      text-align: center;
    }
  }
}
</style>