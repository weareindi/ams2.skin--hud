import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
// import svgLoader from 'vite-svg-loader';
// import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
    main: {
        resolve: {
            alias: {
                '@public': resolve(__dirname, 'resources')
            }
        },
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer'),
                '@main': resolve('src/main'),
                '@public': resolve(__dirname, 'resources')
            }
        },
        plugins: [
            vue(),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "sass:map";
                        @use "sass:math";
                        @import 'src/renderer/assets/scss/bootstrap';
                        `
                }
            }
        },
        build: {
            rollupOptions: {
                input: [
                    'src/renderer/settings.html',
                    'src/renderer/hud.html',
                    'src/renderer/director.html',
                ]
            }
        }
    },
})
