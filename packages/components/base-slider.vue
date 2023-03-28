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

<script setup lang="ts">
import { watch, onMounted, ref, nextTick, onBeforeUnmount } from 'vue';

const emit = defineEmits(["changeValue"]);
const props = withDefaults(defineProps<{
    value: number
    loaded?: number
    max?: number
    min?: number
    vertical?: boolean
    color: string
    step?: boolean
}>(), {
    value: 0,
    loaded: 0,
    max: 100,
    min: 0,
    vertical: false,
    color: "#18a058",
    step: false
});

const activeLoaded = ref(0);
const activePercentage = ref(props.value);
const blockRef = ref<HTMLElement | null>(null);
const sliderRef = ref<HTMLElement | null>(null);

// 点击滑动条
const clickSlider = (e: MouseEvent) => {
    let activeSize: number;
    let percentage: number;
    if (props.vertical) {
        activeSize = sliderRef.value!.clientHeight - (e.clientY - sliderRef.value!.getBoundingClientRect().top);
        percentage = Math.round((activeSize / sliderRef.value!.clientHeight) * 100) / 100;
    } else {
        activeSize = e.clientX - sliderRef.value!.getBoundingClientRect().left;
        percentage = Math.round((activeSize / sliderRef.value!.clientWidth) * 100) / 100;
    }

    if (props.step) {
        percentage = Math.round(percentage * 10) / 10
    }

    activePercentage.value = percentage * 100;
    emit('changeValue', Math.round((props.max - props.min) * percentage * 100) / 100);
}

// 滑动滑动条
const slidingSlider = () => {
    // PC端
    blockRef.value!.onmousedown = function () {
        document.onmousemove = function (e) {
            sliderValueChange(e);
        };
        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
        };
    };
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

//滑动条值改变
const sliderValueChange = (e: MouseEvent | TouchEvent) => {
    let activeSize: number;
    let percentage: number;
    let clientX, clientY: number;

    if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
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

    if (props.step) {
        percentage = Math.round(percentage * 10) / 10
    }

    activePercentage.value = percentage * 100;
    emit('changeValue', Math.round((props.max - props.min) * percentage * 100) / 100);
}

watch(() => props.loaded, (newValue) => {
    activeLoaded.value = Math.round((newValue / (props.max - props.min)) * 10000) / 100;
});

watch(() => props.value, (newValue) => {
    activePercentage.value = Math.round((newValue / (props.max - props.min)) * 10000) / 100;
});

onMounted(() => {
    slidingSlider();
    activePercentage.value = Math.round((props.value / (props.max - props.min)) * 100);
});

onBeforeUnmount(() => {
    //清除touch事件
    document.ontouchmove = document.ontouchend = null;
    //清除mouse事件
    document.onmousemove = document.onmouseup = null;
})
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