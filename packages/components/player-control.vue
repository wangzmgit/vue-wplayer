<template>
    <!--时间轴-->
    <div class="wplayer-time-line">
        <base-slider :mobile="mobile" :color="theme" :value="schedule(videoInfo.currentTime)"
            :loaded="schedule(videoInfo.loadedTime)" @changeValue="currentTimeChange" />
    </div>
    <div class="wplayer-control-box" :class="mobile ? 'wplayer-control-box-mobile' : ''">
        <!--控制栏左-->
        <div class="control-left">
            <base-button type="text" @click="playOrPause">
                <svg-icon class="control-icon" :name="videoInfo.currentPlayIcon"></svg-icon>
            </base-button>
            <span class="time-text">{{ toTimeText(videoInfo.currentTime) }} / {{ toTimeText(videoInfo.duration)
            }}</span>
        </div>
        <!--控制栏中(全屏状态下的弹幕发送区)-->
        <div :class="`control-center${fullState ? '-full' : ''}`"></div>
        <!--控制栏右-->
        <div class="control-right">
            <base-button v-show="!mobile || fullState" class="control-right-btn" type="text" @click="showMenu('quality')">
                {{ videoInfo.qualityText }}
            </base-button>
            <div class="quality-menu" v-show="menus.quality">
                <div v-for="(value, key) in videoInfo.resource" :key="key">
                    <base-button type="text" @click="setQuality(key)">{{ value.name ? value.name : key }}</base-button>
                </div>
            </div>
            <base-button v-show="!mobile || fullState" class="control-right-btn" type="text" @click="showMenu('speed')">
                {{ videoInfo.speedText }}
            </base-button>
            <div class="speed-menu" v-show="menus.speed">
                <span v-for="(item, index) in videoInfo.playbackSpeed" :key="index">
                    <base-button type="text" @click="setSpeed(item)">{{ item === 1 ? '1.0x' : `${item}x` }}
                    </base-button>
                </span>
            </div>
            <!-- 音量 -->
            <base-button class="right-icon" type="text" @click="showMenu('volume')">
                <svg-icon class="control-icon" name="volume"></svg-icon>
            </base-button>
            <div class="volume" v-show="menus.volume">
                <base-slider class="slider" :mobile="mobile" :color="theme" vertical :value="videoInfo.volume"
                    @changeValue="setVolume" />
            </div>
            <base-button class="right-icon" type="text" @click="fullScreen">
                <svg-icon class="control-icon" name="fullScreen"></svg-icon>
            </base-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import useConfig from '../hooks/config';
import SvgIcon from "./svg-icon.vue";
import BaseButton from "./base-button.vue";
import BaseSlider from './base-slider.vue';
import useFullScreen from '../hooks/full-screen';
import { ref, onMounted, reactive } from 'vue';

const emit = defineEmits(['playChange', 'qualityChange', 'full', 'progressChange', 'volumeChange', 'speedChange', 'showMsg']);

const props = withDefaults(defineProps<{
    mobile: boolean
    theme: string
    buffering: boolean
}>(), {
    mobile: false,
    theme: "#18a058",
    buffering: false
});

const { getConfig, setConfig } = useConfig();
const playerConfig = getConfig();

//视频状态
const videoIconState = {
    PLAY: "play",
    PAUSE: "pause",
    REPLAY: "replay"
}

const menus: any = reactive({
    speed: false,
    volume: false,
    quality: false,
})

const videoInfo = reactive({
    resource: {} as QualityType,//视频资源
    duration: 0,//视频时长
    currentPlayIcon: videoIconState.PLAY,//视频状态
    currentTime: 0,//当前时间
    loadedTime: 0,//当前加载时间
    maxQuality: 0,//最大分辨率
    qualityText: "默认",//分辨率文本
    currentQuality: 0,//当前分辨率
    speedText: "倍速", //视频倍速
    playbackSpeed: [] as Array<number>,//倍速选项
    volume: 80, //音量
})

//初始化-设置视频资源
const setResource = (resource: QualityType, maxQuality: number) => {
    videoInfo.resource = resource;
    videoInfo.maxQuality = maxQuality;
}

//初始化-设置视频时长
const setDuration = (val: number) => {
    videoInfo.duration = val;
}

//初始化-设置倍速选项
const setpPlaybackSpeed = (val: Array<number>) => {
    videoInfo.playbackSpeed = val;
}

//视频时间改变
const timeUpdate = (current: number, loaded: number) => {
    videoInfo.currentTime = current;
    videoInfo.loadedTime = loaded;
}

//视频结束
const videoEnd = () => {
    videoInfo.currentPlayIcon = videoIconState.REPLAY;
}

//播放和暂停
const playOrPause = () => {
    let play = true;
    if (videoInfo.currentPlayIcon !== videoIconState.PAUSE && props.buffering) return;
    switch (videoInfo.currentPlayIcon) {
        case videoIconState.PLAY:
            videoInfo.currentPlayIcon = videoIconState.PAUSE;
            break;
        case videoIconState.PAUSE:
            play = false;
            videoInfo.currentPlayIcon = videoIconState.PLAY;
            break;
        case videoIconState.REPLAY:
            videoInfo.currentPlayIcon = videoIconState.PAUSE;
            break;
    }
    emit('playChange', play);
}

//视频进度改变
const currentTimeChange = (progress: number) => {
    //更新视频进度
    videoInfo.currentTime = (progress / 100) * videoInfo.duration;
    emit('progressChange', videoInfo.currentTime);
}

//设置清晰度
const setQuality = (quality: number) => {
    if (quality === 0) return;
    if (videoInfo.currentQuality === quality) return;
    //设置清晰度信息
    videoInfo.currentQuality = quality;
    if (videoInfo.resource[quality].name) {
        videoInfo.qualityText = videoInfo.resource[quality].name!;
    } else {
        videoInfo.qualityText = quality.toString();
    }

    // 调用父组件设置视频资源和播放状态
    const play = videoInfo.currentPlayIcon === videoIconState.PAUSE ? true : false;

    emit("qualityChange", quality, videoInfo.currentTime, play);
    showMenu("");
}

//设置倍速
const setSpeed = (speed: number) => {
    if (speed != 1) {
        videoInfo.speedText = speed + "x";
    } else {
        videoInfo.speedText = "倍速";
    }
    menus.speed = false;
    emit('speedChange', speed);
}

//改变音量
const setVolume = (volume: number) => {
    setConfig('volume', volume);
    emit('volumeChange', volume);
}

//全屏-获取全屏状态
const { isFullScreen } = useFullScreen();
//全屏-全屏状态
const fullState = ref(isFullScreen())
//全屏-点击全屏按钮
const fullScreen = () => {
    emit('full');
}

//快进或快退 是否为右方向(true前进，false后退) 时间n
const fastForward = (right: boolean, n: number) => {
    let res;
    let dur = videoInfo.duration;
    let current = videoInfo.currentTime;
    if (right) {
        res = current + n > dur ? dur : current + n;
    } else {
        res = current - n < 0 ? 0 : current - n;
    }

    emit('progressChange', res);
    emit('showMsg', `快${right ? '进' : '退'}${n}秒`);
}

//计算播放和加载进度
const schedule = (time: number) => {
    return Math.round((time / videoInfo.duration) * 10000) / 100;
}

//转为时间文本
const toTimeText = (time: number) => {
    let m: number = Math.floor(time / 60);
    let s: number = Math.floor(time % 60);
    const mm = m < 10 ? "0" + m : m;
    const ss = s < 10 ? "0" + s : s;
    return mm + ":" + ss;
}

//打开或关闭菜单
const showMenu = (name: any) => {
    //关闭除了name以外所有的菜单
    for (let key in menus) {
        if (key == name) {
            menus[key] = !menus[key];
            continue;
        }
        menus[key] = false;
    }
}

//将方法暴露给父组件
defineExpose({
    playOrPause,
    setDuration,
    timeUpdate,
    videoEnd,
    fastForward,
    setResource,
    setpPlaybackSpeed,
    showMenu
})

onMounted(() => {
    window.onresize = () => {
        fullState.value = isFullScreen();
    }
    //初始化音量
    videoInfo.volume = playerConfig.volume;
    emit('volumeChange', videoInfo.volume);
});
</script>

<style lang="less">
.wplayer-control-box {
    display: flex;

    //图标
    .control-icon {
        box-sizing: border-box;
        padding: 2px;
        width: 30px;
        height: 30px;
        margin-top: 8px;
    }

    .control-left {
        width: 200px;
        display: flex;

        .time-text {
            color: #fff;
            font-size: 14px;
            margin-top: 15px;
        }
    }

    .control-center {
        width: calc(100% - 370px);
    }

    .control-center-full {
        width: calc(100% - 370px);
    }

    .control-right {
        display: flex;
        white-space: nowrap;
        justify-content: space-between;
        width: 230px;

        .control-right-btn {
            padding: 0 10px;
            margin-top: 9px;
            line-height: 30px;
        }

        .quality-menu {
            width: 60px;
            bottom: 56px;
            right: 156px;
            position: absolute;
            text-align: center;
            border-color: transparent;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.5);
        }

        .speed-menu {
            width: 60px;
            bottom: 56px;
            right: 110px;
            position: absolute;
            text-align: center;
            border-color: transparent;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.5);

            span {
                display: block;
            }
        }

        .volume {
            width: 32px;
            height: 140px;
            right: 70px;
            bottom: 56px;
            border-radius: 5px;
            position: absolute;
            background: rgba(0, 0, 0, 0.7);

            .slider {
                position: absolute;
                top: 0;
                left: 14px;
                height: 116px;
            }
        }

        .right-icon {
            padding: 0 10px;
        }
    }
}

.wplayer-control-box-mobile {
    .control-center {
        width: calc(100% - 280px);
    }

    .control-center-full {
        width: calc(100% - 410px);
    }

    .control-right {
        width: 120px;
    }
}
</style>