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

        // data
        electron.ipcRenderer.on('data', async (event, data) => {
            // console.log(data);
        });
        
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
                activeDisplay = 'configActiveStreamDisplay' in config ? config.configActiveStreamDisplay : null;
            }

            return activeDisplay;
        },
        async changeWindow() {
            const activeDisplay = await this.getActiveDisplay();
            await electron.ipcRenderer.invoke('changeWindowDisplay', 'stream', activeDisplay);
        },
        async updateScale() {
            const activeDisplay = await this.getActiveDisplay();
            const scale = await electron.ipcRenderer.invoke('getScale', activeDisplay);
            return document.documentElement.style.setProperty("--font-size", `${scale}%`);
        }
    }
}
</script>
