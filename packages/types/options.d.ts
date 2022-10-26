// import { danmakuType } from "./danmaku"

interface QualityType {
    [key: number]: {
        name?: string,
        url: string,
        type?: string
    }
}

interface danmakuOptionsType {
    open: boolean,
    placeholder?: string,
    data?: Array<danmakuType>,
    send?: (danmaku: danmakuType) => void
}


interface OptionsType {
    resource: string | QualityType,
    cover?: string,
    type?: string,//视频类型
    mobile?: boolean,//移动端
    blob?: boolean,//mp4视频是否使用blob
    customType?: (player: HTMLVideoElement, src: string) => void,
    theme?: string,//主题色,
    danmaku?: danmakuOptionsType,
    playbackSpeed?: Array<number>,// 播放速度
}