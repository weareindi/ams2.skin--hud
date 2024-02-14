<template>
    <div class="m-settings" v-if="open">
        <div class="m-settings__body">
            <div class="m-settings__groups">
                <div class="m-settings__group">
                    <div class="m-settings__items m-settings__items--connections">
                        <div class="m-settings__item">
                            <SettingToggleComponent icon="auto" label="External Crest" v-model="externalCrest" :options="externalCrestOptions" />
                        </div>
                        <div class="m-settings__item" v-if="externalCrest">
                            <SettingInputComponent icon="network" label="IP" v-model="ip" />
                        </div>
                        <div class="m-settings__item" v-if="externalCrest">
                            <SettingInputComponent label="Port" v-model="port" />
                        </div>
                        <div class="m-settings__item">
                            <SettingInputComponent label="Connected" readonly="true" :valid="isConnected" v-model="isConnected" />
                        </div>
                    </div>
                </div>
                <div class="m-settings__group">
                    <div class="m-settings__items m-settings__items--prefs">
                        <div class="m-settings__item">
                            <SettingInputComponent icon="display" label="Tick Rate" v-model="tickRate" type="number" min="1" max="30" />
                        </div>
                        <div class="m-settings__item">
                            <SettingInputComponent icon="display" label="Scale" v-model="scale" type="number" min="50" max="200" step="0.1"  />
                        </div>
                        <div class="m-settings__item">
                            <SettingToggleComponent label="Display on" v-model="activeDisplay" :options="activeDisplayOptions" />
                        </div>
                    </div>
                </div>
                <div class="m-settings__group">
                    <div class="m-settings__items m-settings__items--configs">
                        <div class="m-settings__item">
                            <SettingToggleComponent icon="auto" label="Show settings on start" v-model="startVisible" :options="startVisibleOptions" />
                        </div>
                    </div>
                </div>
                <div class="m-settings__group">
                    <div class="m-settings__items m-settings__items--buttons">
                        <div class="m-settings__item">
                            <SettingButtonComponent label="Check for updates" color="blue" v-if="updateReady === null" @click="updateCheck" />
                            <SettingButtonComponent label="No update found" color="blue" v-if="updateReady === false" @click="updateCheck" :disabled="true" />
                            <SettingButtonComponent label="Download Available" color="green" v-if="updateReady === true" @click="gotoUpdate" />
                        </div> 
                        <div class="m-settings__item">
                            <SettingButtonComponent label="Hide Settings" color="yellow" @click="hideSettings" />
                        </div> 
                        <!-- <div class="m-settings__item">
                            <SettingButtonComponent label="Exit Hud" color="red" @click="exitApp" />
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <span class="m-settings__overlay"></span>
    </div>
</template>

<style lang="scss">

.m-settings {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: em(32);
}

.m-settings__body {
    @include color('background-color', 'black');

    z-index: 100;
    padding: em(12) em(14);
    border-radius: em(8);
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.m-settings__groups {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 em(-32);
}

.m-settings__group {
    padding: 0 em(32);
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.m-settings__items {
    display: flex;
    margin: 0 em(-32);
}

.m-settings__item {
    padding: 0 em(32);
}

.m-settings__items--connections,
.m-settings__items--prefs,
.m-settings__items--configs {
    margin: 0 em(-2);

    .m-settings__item {
        padding: 0 em(2);
    }
}

.m-settings__items--buttons {
    margin: 0 em(-8);

    .m-settings__item {
        padding: 0 em(8);
    }
}

.m-settings__overlay {
    @include color('background-color', 'black', 0.6);

    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

</style>

<script>
import { inject } from 'vue';
import SettingInputComponent from '../components/SettingInputComponent.vue';
import SettingButtonComponent from '../components/SettingButtonComponent.vue';
import SettingToggleComponent from '../components/SettingToggleComponent.vue';

export default {
    async setup() {
        const configExternalCrest = inject('configExternalCrest');
        const configIp = inject('configIp');
        const configPort = inject('configPort');
        const configTickRate = inject('configTickRate');
        const configActiveDisplay = inject('configActiveDisplay');
        const configStartVisible = inject('configStartVisible');
        const configScale = inject('configScale');        
        const isConnected = inject('isConnected');
        const isSettingsOpen = inject('isSettingsOpen');

        // external crest options
        const externalCrestOptions = [
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
            }
        ];

        // display options
        const primaryDisplay = await electron.ipcRenderer.invoke('getPrimaryDisplay');
        const displays = await electron.ipcRenderer.invoke('getDisplays');
        const activeDisplayOptions = displays.map((display) => {
            return {
                label: display.label,
                value: display.id
            }
        });

        // start options
        const startVisibleOptions = [
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
            }
        ];

        return {
            configExternalCrest,
            configIp,
            configPort,
            configTickRate,
            configActiveDisplay,
            configStartVisible,
            configScale,
            isConnected,
            isSettingsOpen,
            primaryDisplay,
            externalCrestOptions,
            activeDisplayOptions,
            startVisibleOptions
        }
    },
    mounted() {
        // update open state based on config
        this.isSettingsOpen = false;
        if (this.configStartVisible === null || this.configStartVisible) {
            this.isSettingsOpen = true;
        }

        // handle 'open settings' from tray menu
        electron.ipcRenderer.on('openSettings', async () => {
            await this.openSettings();
        });
    },
    data() {
        const isUpdateAvailable = null;

        return {
            isUpdateAvailable
        }
    },
    components: {
        SettingInputComponent,
        SettingButtonComponent,
        SettingToggleComponent
    },
    computed:{
        open:{
            get() {
                this.updateMouseState(this.isSettingsOpen);
                return this.isSettingsOpen;
            },
            set(value) {
                this.updateMouseState(value);
                return this.isSettingsOpen = value;
            }
        },
        externalCrest: {
            get() {
                if (this.configExternalCrest === null) {
                    return true; // default
                }

                return this.configExternalCrest;
            },
            set(value) {
                return this.configExternalCrest = value;
            }
        },
        internalCrestOptions: {
            get() {
                return this.internalCrestOptions;
            }
        },
        ip:{
            get() {
                return this.configIp;
            },
            set(value) {
                return this.configIp = value;
            }
        },
        port:{
            get() {
                return this.configPort;
            },
            set(value) {
                return this.configPort = value;
            }
        },
        isConnected: {
            get() {
                if (this.isConnected === null) {
                    return false;
                }

                return this.isConnected;
            }
        },
        tickRate: {
            get() {
                return this.configTickRate;
            },
            set(value) {
                return this.configTickRate = value;
            }
        },
        scale:{
            get() {
                return this.changeScale(this.configScale);
            },
            set(value) {
                return this.configScale = this.changeScale(value);
            }
        },
        activeDisplay: {
            get() {
                if (!this.configActiveDisplay) {
                    return this.activeDisplay = this.primaryDisplay.id;
                }

                return this.changeDisplay(this.configActiveDisplay);
            },
            set(value) {
                return this.configActiveDisplay = this.changeDisplay(value);
            }
        },
        activeDisplayOptions: {
            get() {
                return this.activeDisplayOptions;
            }
        },
        startVisible: {
            get() {
                if (this.configStartVisible === null) {
                    return true; // default
                }

                return this.configStartVisible;
            },
            set(value) {
                return this.configStartVisible = value;
            }
        },
        updateReady: {
            get() {
                if (this.isUpdateAvailable === false) {
                    setTimeout(() => {
                        this.isUpdateAvailable = null;
                    }, 2000);
                }

                return this.isUpdateAvailable;
            },
            set(value) {
                return this.isUpdateAvailable = value;
            }
        },
    },
    methods: {
        changeDisplay(id) {
            electron.ipcRenderer.invoke('changeDisplay', id);
            return id;
        },
        changeScale(scale) {
            document.documentElement.style.setProperty("--font-size", `${scale}%`);
            return scale;
        },
        async hideSettings() {
            return this.open = false;
        },
        async openSettings() {
            return this.open = true;
        },
        exitApp() {
            electron.ipcRenderer.invoke('quit');
        },
        updateMouseState(active) {
            electron.ipcRenderer.invoke('disableMouse');
            if (active) {
                electron.ipcRenderer.invoke('enableMouse');
            }
        },
        async updateCheck() {
            this.isUpdateAvailable = await electron.ipcRenderer.invoke('checkUpdate');
        },
        async gotoUpdate() {
            await this.hideSettings();
            open('https://github.com/weareindi/ams2.skin--hud/releases/latest', '_blank').focus();
        },
    }
}
</script>
