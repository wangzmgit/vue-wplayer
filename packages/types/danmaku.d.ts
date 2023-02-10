export interface DanmakuType {
    time: number,
    color: string,
    type: number,
    text: string,
}

export interface DrawDanmakuType {
    color: string,
    type: number,
    text: string,
}

export interface FilterDanmakuType {
    disableType: Array<number>,
    disableLeave: number,
}