<template>
    <div id="wplayer">
        <div ref="playerRef" class="wplayer-container wplayer-uncheck" @contextmenu.prevent="openCtxMenu"
            @click="clickVideoContainer" @mouseleave="mouseLeavePlayer" @mousemove="mouseMoveOnPlayer">
            <video class="player" ref="videoRef" @canplay="initVideo" @timeupdate="timeUpdate" @ended="videoEnd"
                @waiting="videoWaiting" @playing="videoPlaying"></video>
            <!-- 控制栏 -->
            <div class="control" v-show="showControl">
                <player-control ref="controlRef" :mobile="playerOptions?.mobile" :buffering="videoBuffering"
                    :theme="playerOptions?.theme" @show-msg="changeMsg" @play-change="setPlayState"
                    @progress-change="setProgress" @full="fullScreen" @quality-change="setQuality"
                    @speed-change="setSpeed" @volume-change="setVolume" />
            </div>
            <!-- 弹幕容器 -->
            <danmaku-container ref="danmakuRef" v-if="playerOptions?.danmaku?.open && showDanmaku"
                :overlapping="overlapping" :paused="videoRef?.paused" :list="danmakuList" />
            <!-- 播放器消息 -->
            <player-msg v-show="showMsg" :msg="msg"></player-msg>
            <!-- 缓冲 -->
            <player-buffering v-show="videoBuffering"></player-buffering>
            <!-- 右键菜单 -->
            <context-menu ref="menuRef" @mirror="setMirror"></context-menu>
        </div>
        <!-- 发送弹幕 -->
        <danmaku-send v-if="playerOptions?.danmaku?.open" :mobile="playerOptions.mobile" :show="showDanmaku"
            :disableType="disableType" :disableLeave="disableLeave" :theme="playerOptions?.theme"
            :danmakuOptions="playerOptions.danmaku" @send="sendDanmaku" @show-msg="changeMsg"
            @set-opacity="setDanmakuOpacity" @change-show="changeShowDanmaku" @set-filter="filterDanmaku" />
    </div>
</template>

<script lang="ts">
import useMsg from './hooks/msg';
import useConfig from './hooks/config';
import useQuality from './hooks/quality';
import useShortcutKey from './hooks/shortcut-key';
import useFullScreen from './hooks/full-screen';
import PlayerMsg from './components/player-msg.vue';
import PlayerControl from './components/player-control.vue';
import DanmakuSend from './components/danmaku-send.vue';
import ContextMenu from './components/context-menu.vue';
import PlayerBuffering from './components/player-buffering.vue';
import DanmakuContainer from './components/danmaku-container.vue';
import { defineComponent, ref, onMounted, PropType, onBeforeUnmount } from 'vue';
import { danmakuType, filterDanmakuType } from './types/danmaku';
import { OptionsType, handleOptions, QualityType } from './types/options';


export default defineComponent({
    name: "WPlayer",
    props: {
        options: {
            type: Object as PropType<OptionsType>,
        },
    },
    setup(props) {
        //消息相关
        const { msg, showMsg, changeMsg } = useMsg();
        //设置全屏
        const { playerRef, fullScreen } = useFullScreen();
        //快捷键
        const { handleKeyUp, handleKeyDown } = useShortcutKey();
        // 播放器配置
        const { getConfigItem, setConfig } = useConfig();
        //清晰度
        const { maxQuality, getInitialQuality } = useQuality();

        const playerOptions = ref<null | OptionsType>(null);
        const videoRef = ref<HTMLVideoElement | null>(null);
        const controlRef = ref<InstanceType<typeof PlayerControl> | null>(null);

        //播放器事件-初始化
        const initVideo = () => {
            // 读取视频时长
            controlRef.value?.setDuration(videoRef.value?.duration || 0);
            //结束缓冲
            videoPlaying();
        }

        //播放器事件-更新进度时间
        const timeUpdate = () => {
            let loaded = 0;//加载信息
            const videoDOM = videoRef.value;

            if (videoDOM) {
                const currentTime = videoDOM.currentTime;
                if (videoDOM.buffered.length) {
                    loaded = videoDOM.buffered.end(videoDOM.buffered.length - 1);
                }
                controlRef.value?.timeUpdate(currentTime, loaded);
                //更新弹幕
                danmakuRef.value?.timeUpdate(currentTime);
            }
        }

        //播放器事件-视频结束
        const videoEnd = () => {
            controlRef.value?.videoEnd();
            danmakuRef.value?.clearDanmaku();
        }

        //是否缓冲中
        const videoBuffering = ref(true);

        //播放器事件-缓冲开始
        const videoWaiting = () => {
            videoBuffering.value = true;
            //缓冲中，暂停弹幕
            danmakuRef.value?.startOrPause(false);
        }

        //播放器事件-缓冲结束
        const videoPlaying = () => {
            videoBuffering.value = false;
            //缓冲结束，根据视频状态启动或暂停弹幕
            if (danmakuRef.value && videoRef.value) {
                danmakuRef.value.startOrPause(!videoRef.value.paused);
            }
        }

        //设置视频播放状态
        const setPlayState = (play: boolean) => {
            if (play) {
                videoRef.value?.play();
            } else {
                videoRef.value?.pause();
            }
            if (danmakuRef.value) {
                danmakuRef.value.startOrPause(play);
            }
        }

        //设置视频当前进度
        const setProgress = (currentTime: number) => {
            videoRef.value!.currentTime = currentTime;
            if (danmakuRef.value) {
                danmakuRef.value.clearDanmaku();
            }
        }

        //设置清晰度
        const setQuality = (quality: number, currentTime: number, play: boolean) => {
            handleDiffQualityResource(quality, playerOptions.value!)
            //设置播放时间和状态
            videoRef.value!.currentTime = currentTime;
            setPlayState(play);
        }

        //设置倍速
        const setSpeed = (speed: number) => {
            videoRef.value!.playbackRate = speed;
        }

        //设置音量
        const setVolume = (volume: number) => {
            videoRef.value!.volume = volume / 100;
        }

        //处理不同清晰度视频资源
        const handleDiffQualityResource = (quality: number, options: OptionsType) => {
            const resource = options.resource as QualityType;
            const type = resource[quality].type || options.type;

            if (type !== "mp4") {
                if (options.customType) {
                    options.customType(videoRef.value!, resource[quality].url);
                }
            } else {
                videoRef.value!.src = resource[quality].url;
            }

            setConfig('defaultQuality', quality);
        }

        //弹幕相关
        const overlapping = ref(true);//弹幕是否可重叠
        const disableLeave: number = getConfigItem('disableLeave');
        const disableType: Array<number> = getConfigItem('disableType');
        const danmakuList = ref<Array<danmakuType>>(props.options?.danmaku?.data || [])
        const showDanmaku = ref(getConfigItem('danmaku'));
        const danmakuRef = ref<InstanceType<typeof DanmakuContainer> | null>(null); (null);
        const sendDanmaku = (danmakuForm: danmakuType) => {
            const tmpForm: danmakuType = {
                time: Math.round(videoRef.value?.currentTime || 0),
                text: danmakuForm.text,
                type: danmakuForm.type,
                color: `#${danmakuForm.color}`,
            }

            if (playerOptions.value?.danmaku?.send) {
                playerOptions.value.danmaku.send(tmpForm);
            }
            //绘制弹幕
            danmakuRef.value?.drawDanmaku(tmpForm, true);
        }

        //设置弹幕不透明度
        const setDanmakuOpacity = (opacity: number) => {
            danmakuRef.value?.setOpacity(opacity);
        }

        //设置弹幕开启/关闭
        const changeShowDanmaku = (val: boolean) => {
            if (!val) {
                danmakuRef.value?.clearDanmaku();
            }
            showDanmaku.value = val;
            setConfig('danmaku', val);
        }

        //是否为屏蔽类型
        const isDisableType = (item: danmakuType, disableType: Array<number>) => {
            if (disableType.includes(item.type))
                return true;
            if (disableType.includes(3) && (item.color !== '#fff' && item.color !== '#ffffff'))
                return true;

            return false;
        }

        //过滤弹幕
        const filterDanmaku = (filter: filterDanmakuType) => {
            setConfig('disableType', filter.disableType);
            setConfig('disableLeave', filter.disableLeave);

            overlapping.value = Boolean(filter.disableLeave > 3);
            const originalDanmaku = props.options?.danmaku?.data || [];
            danmakuList.value = originalDanmaku.filter((item) => {
                return !isDisableType(item, filter.disableType) && (Math.floor(Math.random() * 10) + 1) > filter.disableLeave;
            });
        }

        //限执行一遍过滤弹幕
        filterDanmaku({ disableLeave, disableType });

        //右键菜单
        const menuRef = ref<InstanceType<typeof ContextMenu> | null>(null);

        //右键菜单-开启菜单
        const openCtxMenu = (e: MouseEvent) => {
            const y = e.clientY - (videoRef.value?.getBoundingClientRect().top || 0);
            const x = e.clientX - (videoRef.value?.getBoundingClientRect().left || 0);
            const resolution = `${videoRef.value?.videoWidth} X ${videoRef.value?.videoHeight}`;
            menuRef.value?.open(x, y, resolution);
        }

        //右键菜单-设置镜像
        const setMirror = () => {
            videoRef.value?.classList.toggle("wplayer-mirror");
        }


        //右键菜单-单击隐藏菜单，双击视频暂停/播放
        const clickVideoContainer = (() => {
            let timer: number | null = null;
            return () => {
                if (menuRef.value?.menuIsShow()) {
                    menuRef.value?.close();
                }
                if (!timer) {
                    timer = window.setTimeout(() => {
                        clearTimeout(timer!);
                        timer = null;
                    }, 300)
                } else {
                    controlRef.value?.playOrPause();
                    clearTimeout(timer!);
                    timer = null;
                }
            }
        })();

        //控制栏
        const showControl = ref(true);

        //显示/隐藏控制栏-鼠标离开播放器
        const mouseLeavePlayer = (() => {
            let timer: number | null = null;
            return () => {
                if (timer) clearTimeout(timer);
                if (!videoRef.value!.paused) {
                    timer = window.setTimeout(() => {
                        controlRef.value?.showMenu('');
                        showControl.value = false;
                    }, 3000);
                }
            }
        })();

        //显示/隐藏控制栏-鼠标在播放器内移动
        const mouseMoveOnPlayer = (() => {
            let timer: number | null = null;
            return () => {
                if (timer) clearTimeout(timer);
                showControl.value = true;
                timer = window.setTimeout(() => {
                    if (!videoRef.value?.paused) {
                        controlRef.value?.showMenu('');
                        showControl.value = false;
                    }
                }, 3000);
            }
        })();

        onMounted(() => {
            // 读取配置信息
            const options = handleOptions(props.options);
            //处理视频资源信息
            const resource = options.resource as QualityType;
            // 获取视频清晰度信息
            const initialQuality = getInitialQuality(resource);
            //处理视频播放
            handleDiffQualityResource(initialQuality, options);
            //监听快捷键
            document.addEventListener("keydown", ((e: KeyboardEvent) => handleKeyDown(e, {
                ' ': controlRef.value?.playOrPause!,
                'arrowright': () => controlRef.value?.fastForward(true, 10),
                'arrowleft': () => controlRef.value?.fastForward(false, 10),
                'control+m': setMirror
            })));
            document.addEventListener("keyup", handleKeyUp);

            controlRef.value?.setResource(resource, maxQuality.value);
            controlRef.value?.setpPlaybackSpeed(options.playbackSpeed!);
            playerOptions.value = options;
        });

        onBeforeUnmount(() => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        });

        return {
            videoRef,
            playerOptions,
            videoBuffering,
            //清晰度
            maxQuality,
            //控制栏
            controlRef,
            showControl,
            mouseLeavePlayer,
            mouseMoveOnPlayer,
            //播放器事件
            videoEnd,
            initVideo,
            timeUpdate,
            videoWaiting,
            videoPlaying,
            //视频控制
            playerRef,
            setQuality,
            setPlayState,
            setProgress,
            fullScreen,
            setSpeed,
            setVolume,
            //弹幕
            danmakuRef,
            danmakuList,
            showDanmaku,
            overlapping,
            disableType,
            disableLeave,
            sendDanmaku,
            filterDanmaku,
            setDanmakuOpacity,
            changeShowDanmaku,
            //播放器消息
            msg,
            showMsg,
            changeMsg,
            //右键菜单
            menuRef,
            setMirror,
            openCtxMenu,
            clickVideoContainer
        }
    },
    components: {
        PlayerMsg,
        PlayerControl,
        DanmakuSend,
        DanmakuContainer,
        PlayerBuffering,
        ContextMenu
    }
});
</script>

<style lang="less">
/**禁止文字选中 */
.wplayer-uncheck {
    -moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/**镜像翻转 */
.wplayer-mirror {
    will-change: transform;
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
}

.wplayer-container {
    width: 100%;
    height: 100%;
    position: relative;

    .player {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: black;
    }

    .control {
        z-index: 20;
        position: absolute;
        width: 100%;
        height: 50px;
        background: linear-gradient(rgba(0, 0, 0, 0), #000);
        bottom: 0;
        transition: opacity 1s;
        -moz-transition: opacity 1s;
        -webkit-transition: opacity 1s;
        -o-transition: opacity 1s;
    }
}
</style>