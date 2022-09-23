export interface danmakuType {
    time: number,
    color: string,
    type: number,
    text: string,
}

export interface drawDanmakuType {
    color: string,
    type: number,
    text: string,
}

export interface filterDanmakuType {
    disableType: Array<number>,
    disableLeave: number,
}