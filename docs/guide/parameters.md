# 参数
`options` 对象下有以下内容，其中 `resource` 为必填项

|内容|类型|描述|默认值|
|:-----|:-----|:-----|:-----|
|resource|string 或 不同清晰度信息对象|视频资源|-|
|type|string|视频类型|'mp4'|
|mobile|bool|是否为移动端|false|
|theme|string|主题色|'#4b5cc4'|
|playbackSpeed|[]| 播放速度|[0.5, 0.75, 1, 1.5, 2]|
|danmaku.open|bool|是否开启弹幕|false|
|danmaku.placeholder|string|弹幕输入提示|'在这里输入弹幕哦~'|
|danmaku.data|[]| 详情请查看[#弹幕数据](danmaku#弹幕数据)|-|
|danmaku.send|function|发送弹幕回调函数 详情请查看[#发送弹幕](danmaku#发送弹幕) |-|