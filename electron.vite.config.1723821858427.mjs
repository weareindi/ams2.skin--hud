// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
var __electron_vite_injected_dirname = "D:\\Work\\Projects\\a\\ams2.skin--hud";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer"),
        "@public": resolve(__electron_vite_injected_dirname, "resources")
      }
    },
    plugins: [
      vue()
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
          "src/renderer/settings.html",
          "src/renderer/hud.html",
          "src/renderer/autodirector.html",
          "src/renderer/director.html"
        ]
      }
    }
  }
});
export {
  electron_vite_config_default as default
};
