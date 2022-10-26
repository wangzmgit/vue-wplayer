interface danmakuType {
    time: number,
    color: string,
    type: number,
    text: string,
}

interface drawDanmakuType {
    color: string,
    type: number,
    text: string,
}

interface filterDanmakuType {
    disableType: Array<number>,
    disableLeave: number,
}