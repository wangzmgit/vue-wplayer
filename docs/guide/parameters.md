# 参数
`options` 对象下有以下内容，其中 `resource` 为必填项

|内容|类型|描述|默认值|
|:-----|:-----|:-----|:-----|
|resource|string 或 不同清晰度信息对象|视频资源|-|
|type|string|视频类型|'mp4'|
|mobile<sup>[1]</sup>|bool|是否为移动端|false|
|blob<sup>[2]</sup>|bool|mp4是否开启blob|false|
|theme|string|主题色|'#4b5cc4'|
|playbackSpeed|[]| 播放速度|[0.5, 0.75, 1, 1.5, 2]|
|danmaku.open|bool|是否开启弹幕|false|
|danmaku.placeholder|string|弹幕输入提示|'在这里输入弹幕哦~'|
|danmaku.data|[]| 详情请查看[#弹幕数据](danmaku#弹幕数据)|-|
|danmaku.send|function|发送弹幕回调函数 详情请查看[#发送弹幕](danmaku#发送弹幕) |-|

[1]. 如果在移动端使用但不开启此选项可能导致滑块无法滑动等问题。

[2]. 在移动端部分浏览器会出现video标签被劫持的现象，导致进度条、弹幕等功能无法正常使用，如果使用blob类型则不会被劫持，
在flv、hls格式下，flv.js和hls.js已经自动处理为blob类型，而mp4如果使用blob类型需要等待视频加载完成才可播放，
对网络的要求较高，所以mp4没有默认使用blob类型。