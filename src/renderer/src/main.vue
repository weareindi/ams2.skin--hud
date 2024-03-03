<template>
    <div class="v">
        <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transitionName">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<style lang="scss">
.v {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    // cater for mobile notches
    // padding-top: env(safe-area-inset-top);
    // padding-right: env(safe-area-inset-right);
    // padding-bottom: env(safe-area-inset-bottom);
    // padding-left: env(safe-area-inset-left);
}
</style>

<script>
import CustomVars from './assets/scss/_custom-vars.scss?inline';
import localforage from 'localforage';

export default {
    async mounted() {
        // get config
        const config = await localforage.getItem('config');

        await this.changeWindow();

        // scale
        await this.updateScale();
        electron.ipcRenderer.on('updateScale', async () => {
            await this.updateScale();
        });

        // open crest if not external
        if (config && !config.configExternalCrest) {
            await electron.ipcRenderer.invoke('openCrest');
        }

        // create stream window if expected
        if (config && config.configEnabledStreamDisplay) {
            await electron.ipcRenderer.invoke('createStreamWindow');
        }

        //
        // Global
        //

        // allow console logging from main.js
        electron.ipcRenderer.on('console', (e, message) => {
            console.log(message);
        });

        // handle navigation from electron (system tray menu)
        electron.ipcRenderer.on('navigate', (e, routePath) => {
            this.$router.push(routePath);
        })
        
        //
        // View
        //

        // add custom vars to head
        // ... allows me to easily create different color modes
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-vars';
        styleElement.innerHTML = CustomVars;
        document.head.appendChild(styleElement);
    },
    methods: {
        async getActiveDisplay() {
            const config = await localforage.getItem('config');

            let activeDisplay = null;
            if (config) { 
                activeDisplay = 'configActiveMainDisplay' in config ? config.configActiveMainDisplay : null;
            }

            return activeDisplay;
        },
        async changeWindow() {
            const activeDisplay = await this.getActiveDisplay();
            await electron.ipcRenderer.invoke('changeWindowDisplay', 'main', activeDisplay);
        },
        async updateScale() {
            const activeDisplay = await this.getActiveDisplay();
            const scale = await electron.ipcRenderer.invoke('getScale', activeDisplay);
            return document.documentElement.style.setProperty("--font-size", `${scale}%`);
        }
    }
}
</script>
