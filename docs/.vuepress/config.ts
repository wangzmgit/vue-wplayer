import { path } from '@vuepress/utils';
import { defaultTheme, defineUserConfig } from 'vuepress';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'

export default defineUserConfig({
    lang: 'zh-CN',
    title: 'VueWPlayer',
    description: '基于vue + ts开发的弹幕播放器',
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    theme: defaultTheme({
        logo: 'logo.png',
        navbar: [
            { text: "示例", link: "/examples" },
            { text: "指南", link: "/guide/quick_start" },
            { text: "GitHub", link: "http://github.com/wangzmgit/vue-wplayer" }
        ],
        sidebar: {
            "/guide/": [
                "quick_start",
                "parameters",
                "shortcut",
                "danmaku",
                "streaming",
                "quantity"
            ]
        },
        notFound: [
            '这里什么都没有',
            '我们怎么到这来了？',
            '这是一个 404 页面',
            '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',

        editLink: false,
        editLinkText: "编辑此页",
        lastUpdated: true,
        lastUpdatedText: "更新时间",
        contributors: false,
        contributorsText: "贡献者",

        openInNewWindow: '在新窗口打开',
        toggleColorMode: '切换夜间模式',
        toggleSidebar: '切换侧边栏',
    }),
    plugins: [
        registerComponentsPlugin({
            components: {
                WPlayer: path.resolve(__dirname, './components/WPlayer.vue'),
            },
        })
    ],
});