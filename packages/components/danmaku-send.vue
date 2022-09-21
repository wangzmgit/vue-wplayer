<template>
    <div class="wplayer-bottom-bar" :class="mobile?'wplayer-bottom-bar-mobile':''">
        <div class="bottom-left">
            <span v-if="!mobile" class="danmaku-amount">{{ danmakuOptions.data?.length }}条弹幕</span>
            <div class="danmaku-switch">
                <base-switch :value="danmaku" :color="theme" @change="setShow"></base-switch>
            </div>
            <svg-icon class="danmaku-setting" name="setting" color="#888" @click="showMenu = !showMenu" />
        </div>
        <div class="bottom-right">
            <input class="danmaku-input" v-model="danmakuForm.text" :placeholder="danmakuOptions.placeholder"
                @keydown.enter="sendDanmaku" />
            <base-button :disabled="!danmaku" class="send-btn" :color="theme" @click="sendDanmaku">发送</base-button>
        </div>
        <!--弹幕设置-->
        <div v-show="showMenu" class="wplayer-danmaku-menu">
            <div class="danmaku-menu-top">
                <p class="danmaku-menu-title">弹幕颜色</p>
                <div class="customize-color">
                    <span style="color: #fff">#</span>
                    <input type="text" v-model="danmakuForm.color" maxlength="6">
                    <div :style="`background-color: #${danmakuForm.color}`"></div>
                </div>
            </div>
            <div class="color-btn" @click="setColor">
                <div v-for="item in ['fff','e54256','ffe133','64dd17','39ccff','d500f9']" :name="item"
                    :style="`background-color: #${item}`">
                </div>
            </div>
            <p class="danmaku-menu-title">弹幕类型</p>
            <div class="danmaku-type">
                <ul class="type-switch" @click="setType">
                    <li class="type-item" v-for="(item, index) in ['滚动','顶部','底部']" :style="danmakuTypeStyle(index)"
                        :name="index">{{item}}</li>
                </ul>
            </div>
            <p class="danmaku-menu-title">弹幕不透明度</p>
            <base-slider class="opacity" :mobile="mobile" :color="theme" :value="opacity" @changeValue="setOpacity" />
        </div>
    </div>
</template>
  
<script lang="ts">
import { ref, reactive, defineComponent, PropType } from "vue";
import SvgIcon from "./svg-icon.vue";
import BaseSlider from "./base-slider.vue";
import BaseSwitch from "./base-switch.vue";
import BaseButton from "./base-button.vue";
import { danmakuType } from "../types/danmaku";
import { danmakuOptionsType } from '../types/options';
export default defineComponent({
    emits: ['setOpacity', 'changeShow', 'showMsg', 'send'],
    props: {
        show: {
            type: Boolean,
            default: true
        },
        danmakuOptions: {
            type: Object as PropType<danmakuOptionsType>,
            required: true
        },
        mobile: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
        },
    },
    setup(props, ctx) {
        const danmakuForm = reactive<danmakuType>({
            time: 0,
            text: "",
            color: "fff",
            type: 0,
        });

        const danmaku = ref(props.show);
        const showMenu = ref(false);
        const opacity = ref(100);

        //设置弹幕发送类型
        const setType = (e: Event) => {
            const eElement = e.target as HTMLElement;
            const type = parseInt(eElement.getAttribute('name') || '-1');
            if (type >= 0)
                danmakuForm.type = type;
        }

        const danmakuTypeStyle = (type: number) => {
            if (danmakuForm.type === type) {
                return {
                    transition: 'all .3s',
                    backgroundColor: props.theme
                }
            }
            return {};
        }

        //设置弹幕不透明度
        const setOpacity = (val: number) => {
            ctx.emit('setOpacity', val);
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
            ctx.emit('changeShow', val);
        }

        //发送弹幕
        const sendDanmaku = () => {
            showMenu.value = false;
            if (danmakuForm.text == "") {
                ctx.emit('showMsg', "弹幕内容不能为空");
                return;
            }
            //验证颜色
            let reg = new RegExp("^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$");
            if (danmakuForm.color.match(reg) == null) {
                return;
            }

            ctx.emit('send', danmakuForm);
            danmakuForm.text = "";
        }

        return {
            danmaku,
            showMenu,
            opacity,
            danmakuForm,
            setShow,
            setType,
            setOpacity,
            setColor,
            sendDanmaku,
            danmakuTypeStyle,
        }
    },
    components: {
        SvgIcon,
        BaseSlider,
        BaseSwitch,
        BaseButton,
    },
});
</script>
  
<style lang="less">
.wplayer-bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background: #fff;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ebebeb;

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

        .danmaku-setting {
            width: 20px;
            height: 20px;
            margin: 0 10px;
            cursor: pointer;
        }
    }

    .bottom-right {
        width: calc(100% - 200px);
        display: flex;
        align-items: center;

        .danmaku-input {
            height: 26px;
            width: calc(100% - 60px);
            border: 0;
            outline: none;
            padding: 0 2px 0 10px;
            border-radius: 6px;
            background: #ebebeb;
        }

        .send-btn {
            width: 72px;
            height: 26px;
            margin-left: 10px;
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

        .danmaku-input {
            height: 26px;
            width: calc(100% - 60px);
        }

        .send-btn {
            width: 72px;
            height: 26px;
            margin-left: 10px;
        }
    }
}


/**弹幕选项菜单 */
.wplayer-danmaku-menu {
    position: absolute;
    z-index: 20;
    bottom: 40px;
    background: rgba(12, 12, 12, 0.8);
    width: 240px;
    height: 240px;

    .danmaku-menu-top {
        display: flex;
        height: 46px;
        align-items: center;
        justify-content: space-between;
    }

    .danmaku-menu-title {
        color: #fff;
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
                border: 1px solid rgba(161, 161, 161, 0.2);
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
        display: flex;
        flex-wrap: nowrap;

        div {
            width: 30px;
            height: 30px;
            margin: 0 0 5px 8px;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    /**切换弹幕类型 */
    .danmaku-type {
        margin-left: 16px;
    }

    .type-switch {
        padding: 0;
        margin: 0;
        display: flex;
        list-style: none;
        width: 200px;
        border: 1px solid #fff;
        border-radius: 6px;
        overflow: hidden;
    }

    .type-item {
        flex: 1;
        color: #fff;
        padding: 10px;
        text-align: center;
        padding: 6px 6px;
    }

    .opacity {
        width: 90% !important;
        margin: 0 auto;
    }
}
</style>