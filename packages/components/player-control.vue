<template>
    <!--时间轴-->
    <div class="wplayer-time-line">
        <base-slider :color="theme" :value="schedule(videoInfo.currentTime)" :loaded="schedule(videoInfo.loadedTime)"
            @changeValue="currentTimeChange" />
    </div>
    <div class="wplayer-control-box" :class="mobile ? 'wplayer-control-box-mobile' : ''">
        <!--控制栏左-->
        <div class="control-left">
            <div class="control-btn play" type="text" @click="playOrPause">
                <svg-icon class="control-icon" :name="videoInfo.currentPlayIcon"></svg-icon>
            </div>
            <span class="time-text">
                {{ toTimeText(videoInfo.currentTime) }} / {{ toTimeText(videoInfo.duration) }}
            </span>
        </div>
        <!--控制栏中(全屏状态下的弹幕发送区)-->
        <div :class="`control-center${fullState ? '-full' : ''}`"></div>
        <!--控制栏右-->
        <div class="control-right" :class="fullState ? 'control-right-full' : ''">
            <!-- 清晰度 -->
            <div v-show="!mobile || fullState" class="control-btn quality">
                <span>{{ videoInfo.qualityText }}</span>
                <div class="quality-menu">
                    <ul>
                        <li v-for="(value, key) in videoInfo.resource" :key="key" @click="setQuality(key)">
                            {{ value.name ? value.name : key }}
                        </li>
                    </ul>
                    <div class="placeholder"></div>
                </div>
            </div>
            <!-- 倍速 -->
            <div v-show="!mobile || fullState" class="control-btn speed">
                <span>{{ videoInfo.speedText }}</span>
                <div class="speed-menu">
                    <ul>
                        <li v-for="(item, index) in videoInfo.playbackSpeed" :key="index" @click="setSpeed(item)">
                            {{ item === 1 ? '1.0x' : `${item}x` }}
                        </li>
                    </ul>
                    <div class="placeholder"></div>
                </div>
            </div>
            <!-- 音量 -->
            <div class="control-btn volume">
                <svg-icon class="control-icon" name="volume"></svg-icon>
                <div class="volume-menu">
                    <div class="slider-container">
                        <base-slider class="slider" vertical :value="videoInfo.volume" :color="theme"
                            @changeValue="setVolume" />
                    </div>
                    <div class="placeholder"></div>
                </div>
            </div>
            <!-- 全屏 -->
            <div class="control-btn" type="text" @click="fullScreen">
                <svg-icon class="control-icon" name="fullScreen"></svg-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useConfig from '../hooks/config';
import SvgIcon from "./svg-icon.vue";
import BaseSlider from './base-slider.vue';
import useFullScreen from '../hooks/full-screen';
import { ref, onMounted, reactive } from 'vue';
import { QualityType } from '../types/options';

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
}

//设置倍速
const setSpeed = (speed: number) => {
    if (speed != 1) {
        videoInfo.speedText = speed + "x";
    } else {
        videoInfo.speedText = "倍速";
    }
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

//将方法暴露给父组件
defineExpose({
    playOrPause,
    setDuration,
    timeUpdate,
    videoEnd,
    fastForward,
    setResource,
    setpPlaybackSpeed,
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

    .control-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        color: #fff;
        font-size: 14px;
        height: 46px;
        cursor: pointer;

        //图标
        .control-icon {
            box-sizing: border-box;
            width: 36px;
            height: 36px;
            padding: 0 6px;
        }
    }


    .control-left {
        width: 200px;
        display: flex;

        .play {
            padding: 0 12px;
        }

        .time-text {
            color: #fff;
            font-size: 14px;
            margin-top: 14px;
        }
    }

    .control-center {
        width: calc(100% - 370px);
    }

    .control-center-full {
        width: calc(100% - 370px);
    }

    .control-right {
        box-sizing: border-box;
        display: flex;
        white-space: nowrap;
        justify-content: space-between;
        width: 230px;
        padding-right: 12px;

        // 空白占位
        .placeholder {
            width: 100%;
            height: 20px;
            background-color: transparent;
        }
    }

    .control-right-full {
        width: 230px;
    }
}

// 倍速按钮
.speed {
    padding: 0 6px;

    &:hover {
        .speed-menu {
            display: block;
        }
    }

    // 倍速菜单
    .speed-menu {
        width: 60px;
        bottom: 36px;
        right: 108px;
        display: none;
        position: absolute;

        ul {
            margin: 0;
            padding: 0;
            border-color: transparent;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.5);
            list-style: none;

            li {
                color: #fff;
                font-size: 14px;
                line-height: 36px;
                padding: 0;
                margin: 0;
                text-align: center;

                &:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
            }
        }
    }
}

// 清晰度按钮
.quality {
    padding: 0 6px;

    &:hover {
        .quality-menu {
            display: block;
        }
    }

    // 清晰度菜单
    .quality-menu {
        width: 60px;
        bottom: 36px;
        right: 166px;
        display: none;
        position: absolute;

        ul {
            margin: 0;
            padding: 0;
            border-color: transparent;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.5);
            list-style: none;

            li {
                color: #fff;
                font-size: 14px;
                line-height: 36px;
                padding: 0;
                margin: 0;
                text-align: center;

                &:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
            }
        }
    }
}

// 音量按钮
.volume {
    &:hover {
        .volume-menu {
            display: block;
        }
    }

    // 音量菜单
    .volume-menu {
        width: 32px;
        height: 140px;
        right: 70px;
        bottom: 56px;
        border-radius: 5px;
        position: absolute;
        display: none;
        background: rgba(0, 0, 0, 0.7);

        .slider-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

// 移动端控制栏
.wplayer-control-box-mobile {
    .control-center {
        width: calc(100% - 280px);
    }

    .control-center-full {
        width: calc(100% - 410px);
    }

    .control-right {
        width: 120px;

        .volume-menu {
            right: 82px;
        }
    }

    .control-right-full {
        width: 230px;

        .volume-menu {
            right: 70px;
        }

        .quality-menu {
            right: 172px;
        }
    }
}
</style>