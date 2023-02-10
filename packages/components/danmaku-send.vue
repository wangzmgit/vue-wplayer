<template>
    <div class="wplayer-bottom-bar" :class="mobile ? 'wplayer-bottom-bar-mobile' : ''">
        <div class="bottom-left">
            <span v-if="!mobile" class="danmaku-amount">{{ danmakuCount }}条弹幕</span>
            <div class="danmaku-switch">
                <base-switch :value="danmaku" :color="theme" @change="setShow"></base-switch>
            </div>
            <!-- 弹幕设置 -->
            <div class="control-btn setting-type">
                <svg-icon class="setting-icon" name="setting" color="#888" />
                <!--弹幕类型设置-->
                <div class="wplayer-danmaku-setting-menu">
                    <div class="setting-menu-content">
                        <p class="danmaku-menu-title">弹幕屏蔽等级 ({{ filterSetting.disableLeave }})</p>
                        <base-slider class="opacity" :mobile="mobile" :max="10" step :color="theme"
                            :value="filterSetting.disableLeave" @change-value="setDisableLeave" />
                        <p class="danmaku-menu-title">禁用弹幕类型</p>
                        <div class="danmaku-filter">
                            <ul class="wplayer-radio-group" @click="setDisableType">
                                <li class="radio-item" v-for="(item, index) in ['滚动', '顶部', '底部', '彩色']"
                                    :style="disableDanmakuStyle(index)" :name="index">{{ item }}</li>
                            </ul>
                        </div>
                        <p class="danmaku-menu-title">弹幕不透明度</p>
                        <base-slider class="opacity" :mobile="mobile" :color="theme" :value="opacity"
                            @changeValue="setOpacity" />
                    </div>
                    <div class="placeholder"></div>
                </div>
            </div>
        </div>
        <div class="bottom-right">
            <div class="input-container">
                <div class="control-btn setting-style">
                    <svg-icon class="style-icon" color="#666" width="16px" height="16px" name="style" />
                    <div class="wplayer-danmaku-menu">
                        <!--弹幕样式设置-->
                        <div class="style-menu-content">
                            <div class="danmaku-menu-top">
                                <p class="danmaku-menu-title">弹幕颜色</p>
                                <div class="customize-color">
                                    <span style="color: #fff">#</span>
                                    <input type="text" v-model="danmakuForm.color" maxlength="6">
                                    <div :style="`background-color: #${danmakuForm.color}`"></div>
                                </div>
                            </div>
                            <div class="color-btn" @click="setColor">
                                <div v-for="item in ['fff', 'e54256', 'ffe133', 'ff7204', 'a0ee00', '64dd17', '39ccff', 'd500f9',
                                'fb7299', '9b9b9b']" :name="item" :style="`background-color: #${item}`">
                                </div>
                            </div>
                            <p class="danmaku-menu-title">弹幕类型</p>
                            <div class="danmaku-type">
                                <ul class="wplayer-radio-group" @click="setType">
                                    <li class="radio-item" v-for="(item, index) in ['滚动', '顶部', '底部']"
                                        :style="danmakuTypeStyle(index)" :name="index">{{ item }}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="placeholder"></div>
                    </div>
                </div>
                <input v-model="danmakuForm.text" :placeholder="danmakuOptions.placeholder"
                    @keydown.enter="sendDanmaku" />
            </div>
            <base-button :disabled="!danmaku" class="send-btn" :color="theme" @click="sendDanmaku">发送</base-button>
        </div>
    </div>
</template>
  
<script  setup lang="ts">
import { ref, reactive } from "vue";
import SvgIcon from "./svg-icon.vue";
import BaseSlider from "./base-slider.vue";
import BaseSwitch from "./base-switch.vue";
import BaseButton from "./base-button.vue";
import { DanmakuOptionsType } from "../types/options";
import { DanmakuType, FilterDanmakuType } from "../types/danmaku";

const emit = defineEmits(['setOpacity', 'changeShow', 'showMsg', 'send', 'setFilter']);
const props = withDefaults(defineProps<{
    show: boolean
    mobile: boolean
    theme?: string
    disableLeave?: number
    disableType?: number[]
    danmakuOptions: DanmakuOptionsType
}>(), {
    show: true,
    mobile: false,
})

const danmakuForm = reactive<DanmakuType>({
    time: 0,
    text: "",
    color: "fff",
    type: 0,
});

const opacity = ref(100);
const danmaku = ref(props.show);

const filterSetting = reactive<FilterDanmakuType>({
    disableType: props.disableType || [],
    disableLeave: props.disableLeave || 0,
});

//设置弹幕发送类型
const setType = (e: Event) => {
    const eElement = e.target as HTMLElement;
    const type = parseInt(eElement.getAttribute('name') || '-1');
    if (type >= 0)
        danmakuForm.type = type;
}

//弹幕类型选择
const danmakuTypeStyle = (type: number) => {
    if (danmakuForm.type === type) {
        return {
            transition: 'all .3s',
            backgroundColor: props.theme
        }
    }
    return {};
}

//禁用弹幕类型选中样式
const disableDanmakuStyle = (type: number) => {
    if (filterSetting.disableType.includes(type)) {
        return {
            transition: 'all .3s',
            backgroundColor: props.theme
        }
    }
    return {};
}

//设置禁用弹幕类型
const setDisableType = (e: Event) => {
    const eElement = e.target as HTMLElement;
    const type = parseInt(eElement.getAttribute('name') || '-1');
    if (type >= 0) {
        const index = filterSetting.disableType.indexOf(type);
        if (index === -1)
            filterSetting.disableType.push(type);
        else
            filterSetting.disableType.splice(index, 1);
    }
    emit('setFilter', filterSetting);
}

//设置弹幕不透明度
const setOpacity = (val: number) => {
    emit('setOpacity', val);
}

//设置弹幕屏蔽等级
const setDisableLeave = (val: number) => {
    filterSetting.disableLeave = val;
    emit('setFilter', filterSetting);
}

//设置弹幕颜色
const setColor = (e: Event) => {
    const eElement = e.target as HTMLElement;
    const color = eElement.getAttribute('name');
    if (color)
        danmakuForm.color = color;
}

//开启或关闭弹幕
const setShow = (val: boolean) => {
    danmaku.value = val;
    emit('changeShow', val);
}

//发送弹幕
const sendDanmaku = () => {
    if (danmakuForm.text == "") {
        emit('showMsg', "弹幕内容不能为空");
        return;
    }
    //验证颜色
    let reg = new RegExp("^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$");
    if (danmakuForm.color.match(reg) == null) {
        return;
    }

    emit('send', danmakuForm);
    danmakuForm.text = "";
    danmakuCount.value++;
}

// 更新弹幕数量
const danmakuCount = ref(0);
const updateDanmakuCount = (count: number) => {
    danmakuCount.value = count;
}

defineExpose({
    updateDanmakuCount
})
</script>
  
<style lang="less">
.control-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
}

.wplayer-bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background: #fff;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ebebeb;

    // 空白占位
    .placeholder {
        width: 100%;
        height: 10px;
        background-color: transparent;
    }

    .bottom-left {
        width: 200px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .danmaku-amount {
            padding-left: 12px;
            text-align: left;
            font-size: 12px;
            color: #999999;
            line-height: 40px;
            width: 108px;
        }

        .danmaku-switch {
            width: 40px;
        }
    }

    .bottom-right {
        width: calc(100% - 200px);
        display: flex;
        align-items: center;

        .input-container {
            display: flex;
            align-items: center;
            height: 26px;
            width: calc(100% - 60px);
            border-radius: 6px;
            background: #ebebeb;

            input {
                padding: 0;
                width: calc(100% - 50px);
                border: none;
                outline: none;
                line-height: 22px;
                background-color: inherit;
                vertical-align: middle
            }
        }

        .send-btn {
            width: 72px;
            height: 26px;
            margin-left: 10px;
        }
    }
}

// 弹幕设置
.setting-type {
    .setting-icon {
        width: 20px;
        height: 20px;
        margin: 0 10px;
    }

    &:hover {
        .wplayer-danmaku-setting-menu {
            display: block;
        }
    }

    /**弹幕设置菜单 */
    .wplayer-danmaku-setting-menu {
        display: none;
        position: absolute;
        z-index: 10;
        left: 0;
        bottom: 30px;

        .setting-menu-content {
            background: rgba(12, 12, 12, 0.8);
            width: 220px;
            height: 180px;

            .danmaku-menu-title {
                color: #fff;
                font-size: 12px;
                line-height: 16px;
                margin: 0;
                padding: 12px 0 12px 10px;
            }

            .danmaku-filter {
                margin: 0 10px;
            }

            .opacity {
                width: 90% !important;
                margin: 0 auto;
            }
        }
    }
}

// 弹幕样式
.setting-style {
    .style-icon {
        padding: 3px 5px;
    }

    &:hover {
        .wplayer-danmaku-menu {
            display: block;
        }
    }

    /**弹幕样式菜单 */
    .wplayer-danmaku-menu {
        display: none;
        position: absolute;
        z-index: 10;
        left: 106px;
        bottom: 30px;

        .style-menu-content {
            background: rgba(12, 12, 12, 0.8);
            width: 220px;
            height: 200px;

            .danmaku-menu-top {
                display: flex;
                height: 46px;
                align-items: center;
                justify-content: space-between;
            }

            .danmaku-menu-title {
                color: #fff;
                font-size: 12px;
                line-height: 16px;
                margin: 12px 0 12px 10px;
            }

            .customize-color {
                display: flex;
                align-items: center;

                input {
                    width: 80px;
                    height: 24px;
                    margin: 0 8px 0 2px;
                    background-color: transparent;
                    color: #fff;
                    border: 1px solid rgba(161, 161, 161, 0.2);

                    &:focus {
                        border-color: rgba(161, 161, 161, 0.2);
                    }
                }

                div {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
            }

            .color-btn {
                display: grid;
                grid-template-columns: repeat(5, 20%);

                div {
                    width: 26px;
                    height: 26px;
                    margin: 0 0 5px 8px;
                    border-radius: 50%;
                    cursor: pointer;
                }
            }

            /**切换弹幕类型 */
            .danmaku-type {
                margin-left: 8px;
                box-sizing: border-box;
            }
        }
    }
}

.wplayer-bottom-bar-mobile {
    width: calc(100% - 12px);
    padding: 0 6px;

    .bottom-left {
        width: 100px;

        .danmaku-switch {
            width: 40px;
        }

        .danmaku-setting {
            width: 20px;
            height: 20px;
            margin: 0 10px;
            cursor: pointer;
        }
    }

    .bottom-right {
        width: calc(100% - 110px);


        .send-btn {
            width: 72px;
            height: 26px;
            margin-left: 10px;
        }
    }
}

/**单选按钮组 */
.wplayer-radio-group {
    padding: 0;
    margin: 0;
    display: flex;
    list-style: none;
    width: 200px;

    .radio-item {
        flex: 1;
        color: #fff;
        padding: 10px;
        text-align: center;
        font-size: 12px;
        padding: 6px 6px;
        margin-right: -1px;
        border: 1px solid #fff;
        cursor: pointer;


        &:nth-child(1) {
            border-radius: 5px 0 0 5px;
        }

        &:nth-last-child(1) {
            border-radius: 0 5px 5px 0;
        }
    }
}
</style>