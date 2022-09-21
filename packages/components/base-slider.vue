<template>
    <div :class="vertical ? 'wplayer-slider-vertical' : 'wplayer-slider-line'">
        <div ref="sliderRef" class="wplayer-slider-bar" @click="clickSlider($event)">
            <div class="wplayer-loaded" :style="`width: ${activeLoaded}%`"></div>
            <div class="wplayer-slider-played" :style="[`background: ${color}`,
            vertical ? `height: ${activePercentage}%` : `width: ${activePercentage}%`]">
                <div ref="blockRef" class="wplayer-slider-block" :style="`border-color: ${color};`"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch, onMounted, ref, nextTick } from 'vue';
export default defineComponent({
    emits: ['changeValue'],
    props: {
        value: {
            type: Number,
            default: 0,
        },
        loaded: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
        min: {
            type: Number,
            default: 0,
        },
        vertical: {
            type: Boolean,
            default: false
        },
        mobile: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: '#18a058'
        }
    },
    setup(props, ctx) {
        const activeLoaded = ref(0);
        const activePercentage = ref(props.value);
        const blockRef = ref<HTMLElement | null>(null);
        const sliderRef = ref<HTMLElement | null>(null);

        // 点击滑动条
        const clickSlider = (e: MouseEvent) => {
            let activeSize: number;
            let percentage: number;
            if (props.vertical) {
                activeSize = sliderRef.value!.clientHeight - (e.pageY - sliderRef.value!.getBoundingClientRect().top);
                percentage = Math.round((activeSize / sliderRef.value!.clientHeight) * 100) / 100;
            } else {
                activeSize = e.pageX - sliderRef.value!.getBoundingClientRect().left;
                percentage = Math.round((activeSize / sliderRef.value!.clientWidth) * 100) / 100;
            }

            activePercentage.value = percentage * 100;
            ctx.emit('changeValue', Math.round((props.max - props.min) * percentage * 100) / 100);
        }

        // 滑动滑动条
        const slidingSlider = (mobile: boolean) => {
            if (!mobile) {
                // PC端
                blockRef.value!.onmousedown = function () {
                    document.onmousemove = function (e) {
                        sliderValueChange(e);
                    };
                    document.onmouseup = function () {
                        document.onmousemove = document.onmouseup = null;
                    };
                };
            } else {
                //移动端
                blockRef.value!.ontouchstart = function () {
                    document.ontouchmove = function (e) {
                        sliderValueChange(e);
                    };
                    document.ontouchend = function () {
                        document.ontouchmove = document.ontouchend = null;
                    };
                };
            }
        }

        //滑动条值改变
        const sliderValueChange = (e: MouseEvent | TouchEvent) => {
            let activeSize: number;
            let percentage: number;
            let clientX, clientY: number;

            if (e instanceof MouseEvent) {
                clientX = e.pageX;
                clientY = e.pageY;
            } else {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }

            if (props.vertical) {
                activeSize = sliderRef.value!.clientHeight - (clientY - sliderRef.value!.getBoundingClientRect().top);
                percentage = Math.round((activeSize / sliderRef.value!.clientHeight) * 100) / 100;
            } else {
                activeSize = (clientX - sliderRef.value!.getBoundingClientRect().left);
                percentage = Math.round((activeSize / sliderRef.value!.clientWidth) * 100) / 100;
            }

            percentage = Math.max(0, percentage);
            percentage = Math.min(percentage, 1);

            activePercentage.value = percentage * 100;
            ctx.emit('changeValue', Math.round((props.max - props.min) * percentage * 100) / 100);
        }

        watch(() => props.mobile, (newValue) => {
            if (newValue) {
                //切换为touch，清除mouse事件
                document.onmousemove = document.onmouseup = null;
            } else {
                //切换为mouse，清除touch事件
                document.ontouchmove = document.ontouchend = null;
            }
            nextTick(() => {
                slidingSlider(newValue);
            });
        }, { immediate: true });

        watch(() => props.loaded, (newValue) => {
            activeLoaded.value = Math.round((newValue / (props.max - props.min)) * 10000) / 100;
        });

        watch(() => props.value, (newValue) => {
            activePercentage.value = Math.round((newValue / (props.max - props.min)) * 10000) / 100;
        });

        onMounted(() => {
            activePercentage.value = Math.round((props.value / (props.max - props.min)) * 100);
        });

        return {
            blockRef,
            sliderRef,
            activeLoaded,
            activePercentage,
            clickSlider,
        }
    }
});
</script>

<style lang="less">
.wplayer-slider-line {
    margin-left: 6px;
    width: calc(100% - 12px);

    .wplayer-slider-bar {
        position: relative;
        width: 100%;
        background: rgba(107, 107, 107, 0.6);
        height: 4px;
        cursor: pointer;
    }

    .wplayer-loaded {
        position: absolute;
        background: #fff;
        height: 4px;
    }

    .wplayer-slider-played {
        position: absolute;
        height: 4px;

        .wplayer-slider-block {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid;
            transition: 0.2s all;
            user-select: none;
        }
    }
}


.wplayer-slider-vertical {
    height: calc(100% - 24px);
    margin: 12px 0;

    .wplayer-slider-bar {
        position: relative;
        width: 4px;
        height: 100%;
        cursor: pointer;
        background: rgba(107, 107, 107, 0.6);
    }

    .wplayer-slider-played {
        position: absolute;
        width: 100%;
        bottom: 0;

        .wplayer-slider-block {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 2px solid;
            background: #fff;
            transition: 0.2s all;
            user-select: none;
        }
    }
}
</style>