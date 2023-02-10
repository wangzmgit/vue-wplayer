import { ref } from 'vue';
import { QualityType } from '../types/options';
import useConfig from './config';

export default function useQuality() {
    const config = useConfig();
    const maxQuality = ref(0);//最大清晰度下标

    //获取当前清晰度
    const getInitialQuality = (quality: QualityType): number => {
        const keys = Object.keys(quality);
        maxQuality.value = parseInt(keys[keys.length - 1]);
        const defaultQuality = config.getConfigItem('defaultQuality');
        if (!defaultQuality || !quality[defaultQuality]) {
            //默认清晰度不存在，使用最高清晰度
            return maxQuality.value;
        }

        return defaultQuality;
    }

    return {
        maxQuality,
        getInitialQuality
    }
}

