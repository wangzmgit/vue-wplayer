import { DanmakuType } from "./danmaku";

export interface QualityType {
    [key: number]: {
        name?: string,
        url: string,
        type?: string
    }
}

export interface DanmakuOptionsType {
    open: boolean,
    placeholder?: string,
    data?: Array<DanmakuType>,
    send?: (danmaku: DanmakuType) => void
}

export interface OptionsType {
    resource: string | QualityType,
    cover?: string,
    type?: string,//视频类型
    mobile?: boolean,//移动端
    blob?: boolean,//mp4视频是否使用blob
    customType?: (player: HTMLVideoElement, src: string) => void,
    customQualityChange?: (quality: number) => void,
    theme?: string,//主题色,
    danmaku?: DanmakuOptionsType,
    playbackSpeed?: Array<number>,// 播放速度
}