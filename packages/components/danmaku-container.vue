<template>
    <div class="wplayer-danmaku-container" ref="danmakuRef"></div>
</template>
  
<script setup lang="ts">
import { ref, reactive } from "vue";
const props = withDefaults(defineProps<{
    list: Array<DanmakuType>
    paused: boolean
    overlapping: boolean
}>(), {
    paused: true,
    overlapping: true
});

const danmakuRef = ref<HTMLElement | null>(null);
const isPaused = ref(props.paused);//是否暂停
const currentTime = ref(0);//当前时间
const danmakuTunnel = reactive({
    row: [] as Array<{
        speed: number,
        endTime: number,
        // fullEntryTime: number
    }>, //轨道结束的时间
    top: [] as Array<number>,
    bottom: [] as Array<number>,
})

// 播放暂停
const startOrPause = (start: boolean) => {
    const danmakuNodes = danmakuRef.value?.childNodes || [];
    const state = start ? 'running' : 'paused';
    for (let i = 0; i < danmakuNodes.length; i++) {
        (danmakuNodes[i] as HTMLElement).style.animationPlayState = state;
    }
    isPaused.value = !start;
}

//清除弹幕
const clearDanmaku = () => {
    danmakuTunnel.row = [];
    danmakuTunnel.top = [];
    danmakuTunnel.bottom = [];
    danmakuRef.value!.innerHTML = "";
}

//设置弹幕不透明度
const setOpacity = (opacity: number) => {
    if (danmakuRef.value) {
        danmakuRef.value.style.opacity = (opacity * 0.01).toString();
    }
}

//更新时间
const timeUpdate = (time: number) => {
    if (Math.round(time) !== currentTime.value) {
        currentTime.value = Math.round(time);
        //绘制弹幕
        if (!props.list) {
            return;
        }
        const currentDanmaku = props.list.filter((item: DanmakuType) => {
            return item.time === currentTime.value;
        })

        currentDanmaku.map((item: DanmakuType) => {
            drawDanmaku(item, false);
        })
    }
}

//获取滚动轨道
const getRowTunnel = (text: string, currentTime: number, duration: number = 5) => {
    const danmakuWidth = text.length * 22;//暂定22px
    const videoWidth = danmakuRef.value!.offsetWidth;
    //当前弹幕运行速度
    const danmakuSpeed = (danmakuWidth + videoWidth) / duration;
    //弹幕到达视频左边时间
    const reachLeftTime = currentTime + (videoWidth / danmakuSpeed);
    //轨道数量
    const tunnelCount = Math.floor(danmakuRef.value!.offsetHeight / 26) - 1;
    //尝试在现有的轨道内添加弹幕
    for (let i = 0; i < danmakuTunnel.row.length; i++) {
        if (danmakuTunnel.row[i].endTime < reachLeftTime) {
            danmakuTunnel.row[i].endTime = currentTime + duration;
            danmakuTunnel.row[i].speed = danmakuSpeed;
            return i;
        }
    }
    //如果没有则尝试新增加轨道
    if (danmakuTunnel.row.length < tunnelCount) {
        danmakuTunnel.row.push({
            endTime: currentTime + duration,
            speed: danmakuSpeed,
        });
        return danmakuTunnel.row.length - 1;
    }
    //如果不可以新增轨道但可以重叠，则使用随机轨道
    if (props.overlapping)
        return Math.round(Math.random() * tunnelCount);
    return -1;
}

//获取固定轨道
const getFixedTunnel = (type: number, currentTime: number) => {
    //计算轨道数量
    const tunnelCount = Math.floor(danmakuRef.value!.offsetHeight / 26) - 1;
    switch (type) {
        case 1:
            //遍历轨道
            for (let i = 0; i < danmakuTunnel.row.length; i++) {
                //如果轨道未被占用，选择该轨道
                if (danmakuTunnel.top[i] <= currentTime) {
                    danmakuTunnel.top[i] = currentTime + 5;
                    return i;
                }
            }
            //如果没有则尝试新增加轨道
            if (danmakuTunnel.top.length < tunnelCount) {
                danmakuTunnel.top.push(currentTime + 5);
                return danmakuTunnel.top.length - 1;
            }
            break;
        case 2:
            //遍历底部弹幕轨道
            for (let i = 0; i < danmakuTunnel.bottom.length; i++) {
                //如果轨道未被占用，选择该轨道
                if (danmakuTunnel.bottom[i] <= currentTime) {
                    danmakuTunnel.bottom[i] = currentTime + 5;
                    return i;
                }
            }
            //如果没有则尝试新增加轨道
            if (danmakuTunnel.bottom.length < tunnelCount) {
                danmakuTunnel.bottom.push(currentTime + 5);
                return danmakuTunnel.bottom.length - 1;
            }
            break;
    }
    //如果不可以新增轨道但可以重叠，则使用随机轨道
    if (props.overlapping)
        return Math.round(Math.random() * tunnelCount);

    return -1;
}

const drawDanmaku = (draw: DrawDanmakuType, send: boolean) => {
    const item = document.createElement("span");
    item.style.color = draw.color;
    item.className = "danmaku-item";
    //滚动弹幕
    if (draw.type == 0) {
        //设置轨道
        const duration = (danmakuRef.value?.offsetWidth || 750) / 150;
        const rowTunnel = getRowTunnel(draw.text, currentTime.value, duration);
        if (rowTunnel === -1) return;
        item.style.top = `${rowTunnel * 26}px`;
        item.style.animation = `danmaku ${duration}s linear`

        item.appendChild(document.createTextNode(draw.text));
        if (send) {
            item.style.border = "1px solid red";
        }
    } else {
        //固定弹幕
        const fixedTunnel = getFixedTunnel(draw.type, currentTime.value);
        if (fixedTunnel === -1) return;
        item.style.width = "100%";
        item.style.textAlign = "center";
        item.style[draw.type === 1 ? 'top' : 'bottom'] = `${fixedTunnel * 26}px`;
        //固定弹幕外层span的宽度为100%，如果给弹幕加上border会占满一行
        //所以需要给文字再加一层span，并在该span上根据需要添加border
        const textNode = document.createElement('span');
        textNode.appendChild(document.createTextNode(draw.text));
        if (send) {
            textNode.style.border = "1px solid red";
        }
        item.appendChild(textNode)
    }

    danmakuRef.value?.appendChild(item);
    item.addEventListener("animationend", () => {
        danmakuRef.value?.removeChild(item);
    });
    item.classList.add(`danmaku-${draw.type === 0 ? 'row' : 'center'}-move`);
    //如果当前为暂停状态则暂停弹幕动画
    if (isPaused.value) {
        item.style.animationPlayState = "paused";
    }
}

defineExpose({
    timeUpdate,
    setOpacity,
    drawDanmaku,
    clearDanmaku,
    startOrPause
});
</script>
  
<style lang="less">
.wplayer-danmaku-container {
    z-index: 1;
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 100%;

    .danmaku-item {
        position: absolute;
        font-size: 22px;
        white-space: nowrap;
        text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000;
    }

    .danmaku-row-move {
        will-change: transform;
        animation-play-state: running;
    }

    .danmaku-center-move {
        will-change: transform;
        animation: danmaku-center 5s linear;
        animation-play-state: running;
    }

    @keyframes danmaku {
        from {
            left: 100%;
            transform: translate3d(0, 0, 0);
        }

        to {
            left: 0;
            transform: translate3d(-100%, 0, 0);
        }
    }

    @keyframes danmaku-center {
        from {
            visibility: visible;
        }

        to {
            visibility: visible;
        }
    }
}
</style>  