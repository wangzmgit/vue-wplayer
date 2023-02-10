import { App } from 'vue';
import WPlayer from './wplayer.vue';
import { OptionsType } from './types/options';
import { DanmakuType } from './types/danmaku';

// 定义 install 方法， App 作为参数
const install = (app: App): void => {
    app.component(WPlayer.name, WPlayer);
}

export {
    WPlayer
};

export type {
    OptionsType,
    DanmakuType
};

export default {
    install
}