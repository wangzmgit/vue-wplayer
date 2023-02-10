# 弹幕

弹幕部分完整配置如下

```js
options: {
    ...
    danmaku: {
        open: true,
        placeholder: '在这里输入弹幕哦~',
        data: [],
        send: null
    }
    ...
}
```
### 开启弹幕

播放器默认不开启弹幕功能，如需开启首先要把 `options.danmaku.open` 配置为 `true`。

### 弹幕数据
弹幕数据为一个弹幕信息数组，格式如下：
```js
export interface danmakuType {
    time: number,
    color: string,
    type: number,
    text: string,
}
```

|内容|类型|描述|
|:-----|:-----|:-----|
|time|int|弹幕出现时间|
|color|string|16进制颜色值|
|type|int|弹幕类型 0滚动 1顶部 2底部|
|text|string|弹幕内容|

### 发送弹幕
在单击发送弹幕后，会执行 `options.danmaku.send` 中传入的函数，函数参数与 [#弹幕数据](#弹幕数据) 中的 `danmakuType` 相同。

### 刷新弹幕数据
默认情况下，修改`options.danmaku.data`中的数据，播放器弹幕数据不会改变，如果需要动态修改弹幕数据，可增加`danmaku-key`配置，如以下代码所示
```vue
  <w-player :options="options" :danmaku-key="0"></w-player>
```
`danmaku-key`为数字类型，改变后会重新加载`options.danmaku.data`中的数据，实现刷新弹幕列表。
