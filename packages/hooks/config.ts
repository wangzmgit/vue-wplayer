export default function useConfig() {
    const configItems = ["defaultQuality", "danmaku", "volume", "disableType", "disableLeave"];
    const getConfig = () => {
        const config = localStorage.getItem("wplayer-config");
        if (!config) {
            return initConfig();
        }

        const objConfig = JSON.parse(config);
        // 检查配置项是否存在
        const configKeys = Object.keys(objConfig);
        for (const item of configItems) {
            if (!configKeys.includes(item)) {
                initConfig();
            }
        }

        return objConfig;
    }

    const getConfigItem = (key: string) => {
        const content = getConfig();
        return content[key];
    }

    const setConfig = (key: string, value: any) => {
        const readConfig = localStorage.getItem("wplayer-config");
        const config = JSON.parse(readConfig ? readConfig : "{}");
        config[key] = value;
        localStorage.setItem("wplayer-config", JSON.stringify(config));
    }

    const initConfig = () => {
        const config = {
            defaultQuality: 720,//默认分辨率
            danmaku: true,
            volume: 80,
            disableType: [],
            disableLeave: 0,
        }
        localStorage.setItem("wplayer-config", JSON.stringify(config));
        return config;
    }

    return {
        getConfig,
        setConfig,
        getConfigItem
    }
}

