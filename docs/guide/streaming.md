# 流媒体

:::tip
在视频类型不为`mp4`时，会执行 `options.customType` 传入的函数，函数传递两个参数，分别是播放器元素和视频链接。
:::

## HLS
安装 hls.js
```
npm install hls.js --save
```

```js
import Hls from "hls.js";

const hls = ref<Hls | null>(null);
const options = {
  resource: "视频链接",
  type: "hls",
  customType: function (player: HTMLVideoElement, url: string) {
    hls.value = new Hls()
    hls.value.loadSource(url);
    hls.value.attachMedia(player);
    hls.value.on(Hls.Events.ERROR, () => {
      console.error("资源加载失败");
    });
  },
  ...
}
```

## FLV
安装 flv.js
```
npm install flv.js --save
```

```js
import flvjs from 'flv.js'

const options = {
  resource: "视频链接",
  type: "flv",
  customType: function (player: HTMLVideoElement, url: string) {
    const flv = flvjs.createPlayer({
      type:'flv',
      url: url,
    });
    flv.attachMediaElement(player);
    flv.load();
  },
  ...
}
```