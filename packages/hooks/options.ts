export function handleOptions(options: OptionsType | undefined) {
    const defaultOptions: OptionsType = {
        resource: "",
        type: "mp4",//视频类型
        theme: "#4b5cc4",//主题色,
        mobile: false,
        blob: false,//mp4视频是否使用blob
        danmaku: {
            open: false,
            placeholder: "在这里输入弹幕哦~"
        },
        playbackSpeed: [0.5, 0.75, 1, 1.5, 2],// 播放速度
    }

    const newOptions = Object.assign(defaultOptions, options);

    //处理清晰度信息
    if (typeof newOptions?.resource === 'string') {
        newOptions.resource = {
            0: {
                name: '默认',
                url: newOptions.resource,
            }
        }
    }

    //处理弹幕配置信息
    if (newOptions.danmaku && !newOptions.danmaku.placeholder) {
        newOptions.danmaku.placeholder = "在这里输入弹幕哦~";
    }

    return newOptions;
}