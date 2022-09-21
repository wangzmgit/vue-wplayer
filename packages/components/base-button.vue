<template>
    <button type="button" :class="['wplayer-btn', `wplayer-btn-${type}`]" :disabled="disabled" :style="primaryStyle()">
        <slot></slot>
    </button>
</template>
<script lang="ts">
import { defineComponent, } from 'vue';

export default defineComponent({
    props: {
        type: {
            type: String,
            default: "primary",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: '#18a058'
        }
    },
    setup(props) {
        const primaryStyle = () => {
            if (props.type === "primary") {
                return {
                    backgroundColor: props.color,
                    ":hover": {
                        backgroundColor: 'red',
                    }
                }
            }
            return {};
        }

        return {
            primaryStyle,
        }
    }
});
</script>
  
<style lang="less">
.wplayer-btn {
    font-weight: 400;
    font-size: 14px;
    height: 32px;
    outline: none;
    cursor: pointer;
    padding: 0 15px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
}

button[disabled] {
    opacity: 0.6;
    cursor: default;
}

.wplayer-btn-primary {
    color: #fff;
    border: none;
}

.wplayer-btn-text {
    color: #fff;
    background: transparent;
    border-color: transparent;
}
</style>
  