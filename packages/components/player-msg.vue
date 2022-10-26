<template>
    <span class="wplayer-msg">{{ props.msg }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ 
    msg: string 
}>();

</script>

<style>
.wplayer-msg {
    z-index: 3;
    position: absolute;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    width: 160px;
    height: 26px;
    left: 10px;
    bottom: 60px;
    line-height: 26px;
    border-radius: 2px;
    color: aliceblue;
}
</style>