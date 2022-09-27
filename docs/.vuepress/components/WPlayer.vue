<template>
    <component v-if="dynamicComponent" :is="dynamicComponent" :options="options"></component>
</template>
  
<script lang="ts">
import '../../../dist/style.css';
import danmakuList from './danmaku.json';
import { defineComponent, onMounted, shallowRef } from 'vue';

export default defineComponent({
    setup() {
        const dynamicComponent = shallowRef(null);
        const options = {
            resource: {
                360: {
                    name: '标清',
                    type: "mp4",
                    url: 'http://upfile.myfz.fun/uploads%2F2022%2F09%2F24%2Fge4ZfU9g_137649199_u2-1-208.mp4'
                },
            },
            danmaku: {
                open: true,
                data: danmakuList
            }
        }

        onMounted(() => {
            import('../../../dist/index').then(module => {
                dynamicComponent.value = module.WPlayer;
            });
        });

        return {
            options,
            dynamicComponent
        }
    },
});
</script>