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
import CustomVars from '../assets/scss/_custom-vars.scss?inline';

export default {
    async mounted() {
        // Add custom CSS vars to head
        const styleElement = document.createElement('style');
        styleElement.id = 'custom-vars';
        styleElement.innerHTML = CustomVars;
        document.head.appendChild(styleElement);

        // scale
        // ... after mount, request scale
        electron.ipcRenderer.invoke('setScale', 'DirectorWindow', 'DirectorDisplay');
        electron.ipcRenderer.on('setScale', async (event, scale) => {
            await this.setScale(scale);
        });
    },
    methods: {
        async setScale(scale) {
            return document.documentElement.style.setProperty("--font-size", `${scale}%`);
        }
    }
}
</script>