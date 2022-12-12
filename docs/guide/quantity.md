# 清晰度切换

如果一个视频有多个不同清晰度的链接，`options.resource` 可以传一个视频链接的对象，具体格式如下：
```js
export interface QualityType {
    [key: number]: {
        name?: string,
        url: string,
        type?: string
    }
}
//每个视频可以单独指定视频类型，如果未指定类型则使用 `options.type` 的类型。
```

示例：
```js
options: {
    ...
    resource: {
        360: {
          name: '标清',
          type: "mp4",
          url: ''
        },
        720: {
          name: '超清',
          type: "mp4",
          url: ''
        }
    }
    ...
    // 自定义清晰度切换
    customQualityChange: function(quality) {

    }
}
```