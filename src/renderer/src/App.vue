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

        //
        // Global
        //

        // allow console logging from main.js
        electron.ipcRenderer.on('console', (e, message) => {
            console.log(message);
        });

        // move to expected display on start
        if (config && config.configActiveDisplay) {
            await electron.ipcRenderer.invoke('changeDisplay', config.configActiveDisplay);
        }

        // handle navigation from electron (system tray menu)
        electron.ipcRenderer.on('navigate', (e, routePath) => {
            this.$router.push(routePath);
        })

        // open crest if not external
        if (config && !config.configExternalCrest) {
            await electron.ipcRenderer.invoke('openCrest');
        }

        // scale
        const scale = await electron.ipcRenderer.invoke('getScale');
        document.documentElement.style.setProperty("--font-size", `${scale}%`);
        
        //
        // View
        //

        // add custom vars to head
        // ... allows me to easily create different color modes
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-vars';
        styleElement.innerHTML = CustomVars;
        document.head.appendChild(styleElement);
    }
}
</script>
