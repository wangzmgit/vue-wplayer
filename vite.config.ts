import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'packages',
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'packages/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, 'examples')
    }
  },
  build: {
    target: "modules",
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'vue-wplayer',
      formats: ["es"]
    },
    rollupOptions: {
      external: ['vue'],
      input: ["packages/index.ts"],
      output: {
        globals: {
          vue: 'Vue',
        },
        format: 'es',
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'packages'
      }
    }
  }
})