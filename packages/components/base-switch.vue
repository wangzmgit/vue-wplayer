<template>
    <div class="wplayer-switch" @click="openSwitch()">
        <div class="switch-bg" :style="`background-color: ${color}`" :class="open ? 'open-bg' : ''">
            <span class="text" v-show="open">弹</span>
            <div class="switch-btn" :class="open ? 'open-btn' : ''"></div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(["change"]);
const props = withDefaults(defineProps<{
    value: boolean
    color: string
}>(), {
    value: true,
    color: "#18a058",
});

const open = ref(props.value);

const openSwitch = () => {
    open.value = !open.value;
    emit("change", open.value);
}
</script>
  
<style lang="less">
.wplayer-switch {
    position: relative;
    width: 32px;
    height: 18px;
    border-radius: 22px;
    border: 1px solid #e9e9e9;
    cursor: pointer;

    .switch-bg {
        width: 16px;
        height: 18px;
        border-radius: 50px;
        transition: width 0.5s;
        -moz-transition: width 0.5s;
        -webkit-transition: width 0.5s;

        .switch-btn {
            position: absolute;
            top: -1px;
            left: -3px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid #e9e9e9;
            transition: left 0.5s;
            -moz-transition: left 0.5s;
            -webkit-transition: left 0.5s;
            -o-transition: left 0.5s;
        }

        .text {
            font-size: 10px;
            position: absolute;
            color: #fff;
            left: 6px;
        }

        .open-btn {
            left: 18px;
        }
    }

    .open-bg {
        width: 36px;
    }
}
</style>
  