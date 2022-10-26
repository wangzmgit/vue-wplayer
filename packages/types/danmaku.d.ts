interface DanmakuType {
    time: number,
    color: string,
    type: number,
    text: string,
}

interface DrawDanmakuType {
    color: string,
    type: number,
    text: string,
}

interface FilterDanmakuType {
    disableType: Array<number>,
    disableLeave: number,
}