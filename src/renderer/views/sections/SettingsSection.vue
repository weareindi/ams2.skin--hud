<template>
    <div class="s-settings">
        <div class="s-settings__body">
            <div class="s-settings__rows">
                <div class="s-settings__row">
                    <div class="s-settings__groups">
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--connections">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="auto" label="External Crest" v-model="ExternalCrest" :options="ExternalCrestOptions" />
                                </div>
                                <div class="s-settings__item" v-if="ExternalCrest">
                                    <SettingInputComponent icon="network" label="IP" v-model="IP" />
                                </div>
                                <div class="s-settings__item" v-if="ExternalCrest">
                                    <SettingInputComponent label="Port" v-model="Port" />
                                </div>
                                <div class="s-settings__item">
                                    <SettingInputComponent label="Connected" readonly="true" :valid="Connected" v-model="Connected" />
                                </div>
                            </div>
                        </div>
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingInputComponent icon="display" label="Tick Rate" v-model="TickRate" type="number" min="1" max="30" />
                                </div>
                            </div>
                        </div>
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--configs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="auto" label="Show settings on start" v-model="SettingsOnStartup" :options="SettingsOnStartupOptions" />
                                </div>
                            </div>
                        </div>
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--buttons">
                                <div class="s-settings__item">
                                    <SettingButtonComponent label="Check for updates" color="blue" v-if="updateReady === null" @click="updateCheck" />
                                    <SettingButtonComponent label="No update found" color="blue" v-if="updateReady === false" @click="updateCheck" :disabled="true" />
                                    <SettingButtonComponent label="Download Available" color="green" v-if="updateReady === true" @click="gotoUpdate" />
                                </div> 
                                <div class="s-settings__item">
                                    <SettingButtonComponent label="Hide Settings" color="yellow" @click="hideSettings" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="s-settings__hr" v-if="Developer">
                <div class="s-settings__row" v-if="Developer">
                    <div class="s-settings__header">
                        <h1 class="s-settings__heading">Developer</h1>
                    </div>
                    <div class="s-settings__groups">
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="auto"  label="Debug" v-model="Debug" :options="DebugOptions" />
                                </div>
                            </div> 
                        </div>
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent label="Mock Fetch" v-model="MockFetch" :options="MockFetchOptions" />
                                </div>
                                <div class="s-settings__item" v-if="MockFetch">
                                    <SettingToggleComponent label="Mock State" v-model="MockState" :options="MockStateOptions" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="s-settings__hr">
                <div class="s-settings__row">
                    <div class="s-settings__header">
                        <h1 class="s-settings__heading">Settings</h1>
                    </div>
                    <div class="s-settings__groups">
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="display" label="Display on" v-model="SettingsDisplay" :options="SettingsDisplayOptions" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="s-settings__hr">
                <div class="s-settings__row">
                    <div class="s-settings__header">
                        <h1 class="s-settings__heading">Hud</h1>
                    </div>
                    <div class="s-settings__groups">
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="display" label="Enabled" v-model="HudEnabled" :options="HudEnabledOptions" />
                                </div>
                                <div class="s-settings__item" v-if="HudEnabled">
                                    <SettingToggleComponent label="Display on" v-model="HudDisplay" :options="HudDisplayOptions" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <hr class="s-settings__hr">
                <div class="s-settings__row">
                    <div class="s-settings__header">
                        <h1 class="s-settings__heading">AutoDirector</h1>
                    </div>
                    <div class="s-settings__groups">
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="display" label="Enabled" v-model="AutoDirectorEnabled" :options="AutoDirectorEnabledOptions" />
                                </div>
                                <div class="s-settings__item" v-if="AutoDirectorEnabled">
                                    <SettingToggleComponent label="Display on" v-model="AutoDirectorDisplay" :options="AutoDirectorDisplayOptions" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
                <hr class="s-settings__hr">
                <div class="s-settings__row">
                    <div class="s-settings__header">
                        <h1 class="s-settings__heading">Director</h1>
                    </div>
                    <div class="s-settings__groups">
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="display" label="Enabled" v-model="DirectorEnabled" :options="DirectorEnabledOptions" />
                                </div>
                                <div class="s-settings__item" v-if="DirectorEnabled">
                                    <SettingToggleComponent label="Display on" v-model="DirectorDisplay" :options="DirectorDisplayOptions" />
                                </div>
                            </div>
                        </div>
                        <div class="s-settings__group" v-if="DirectorEnabled">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingToggleComponent icon="auto" label="Default View" v-model="DirectorDefaultView" :options="DirectorDefaultViewOptions" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="s-settings__row" v-if="DirectorEnabled">
                    <div class="s-settings__header">
                        <h1 class="s-settings__heading">Key Binds</h1>
                    </div>
                    <div class="s-settings__groups">
                        <div class="s-settings__group">
                            <div class="s-settings__items s-settings__items--prefs">
                                <div class="s-settings__item">
                                    <SettingKeyPressComponent icon="auto" label="Auto" v-model="DirectorCommandAuto" readonly="true" />
                                </div>
                                <div class="s-settings__item">
                                    <SettingKeyPressComponent label="Blank" v-model="DirectorCommandBlank" readonly="true" />
                                </div>
                                <div class="s-settings__item">
                                    <SettingKeyPressComponent label="Solo" v-model="DirectorCommandSolo" readonly="true" />
                                </div>
                                <div class="s-settings__item">
                                    <SettingKeyPressComponent label="Leaderboard" v-model="DirectorCommandLeaderboard" readonly="true" />
                                </div>
                                <div class="s-settings__item">
                                    <SettingKeyPressComponent label="Standings" v-model="DirectorCommandStandings" readonly="true" />
                                </div>
                                <div class="s-settings__item">
                                    <SettingKeyPressComponent label="Battle" v-model="DirectorCommandBattle" readonly="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span class="s-settings__overlay"></span>
    </div>
</template>

<style lang="scss">

.s-settings {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: em(32);
}

.s-settings__body {
    @include color('background-color', 'black');

    z-index: 100;
    padding: em(12) em(14);
    border-radius: em(8);
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.s-settings__hr {
    @include color('background-color', 'white', 0.1);

    margin: em(16) 0;
    padding: 0;
    border: 0;
    height: 1px;
}

.s-settings__header {
    ~ .s-settings__groups {
        margin-top: em(8);
    }
}

.s-settings__heading {
    @include color('color', 'white', 1);

    font-size: em(18);
}

.s-settings__rows {}

.s-settings__row {
    + .s-settings__row {
        @include color('background-color', 'white', 0.1);
        
        margin-top: em(16);
        padding: em(16);
        border-radius: 4px;

        .s-settings__heading {
            font-size: em(16);
        }
    }
}

.s-settings__groups {
    display: flex;
    align-items: left;
    margin: 0 em(-32);
}

.s-settings__group {
    padding: 0 em(32);
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.s-settings__items {
    display: flex;
    margin: 0 em(-32);
}

.s-settings__item {
    padding: 0 em(32);
}

.s-settings__items--connections,
.s-settings__items--prefs,
.s-settings__items--configs {
    margin: 0 em(-2);

    .s-settings__item {
        padding: 0 em(2);
    }
}

.s-settings__items--buttons {
    margin: 0 em(-8);

    .s-settings__item {
        padding: 0 em(8);
    }
}

.s-settings__overlay {
    @include color('background-color', 'black', 0.4);

    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

</style>

<script>
import { inject  } from 'vue';
import SettingInputComponent from '@renderer/views/components/SettingInputComponent.vue';
import SettingKeyPressComponent from '@renderer/views/components/SettingKeyPressComponent.vue';
import SettingButtonComponent from '@renderer/views/components/SettingButtonComponent.vue';
import SettingToggleComponent from '@renderer/views/components/SettingToggleComponent.vue';

export default {
    async setup() {
        // start up
        const SettingsOnStartup = inject('SettingsOnStartup');
        const SettingsOnStartupOptions = inject('SettingsOnStartupOptions'); 
        
        // debug
        const Debug = inject('Debug');
        const DebugOptions = inject('DebugOptions');
        
        // mock
        const Developer = inject('Developer');
        const MockFetch = inject('MockFetch');
        const MockFetchOptions = inject('MockFetchOptions');
        const MockState = inject('MockState');
        const MockStateOptions = inject('MockStateOptions');

        // crest
        const ExternalCrest = inject('ExternalCrest');
        const ExternalCrestOptions = inject('ExternalCrestOptions');
        const IP = inject('IP');
        const Port = inject('Port');
        const TickRate = inject('TickRate');
        const Connected = inject('Connected');

        // settings
        const SettingsDisplay = inject('SettingsDisplay');
        const SettingsDisplayOptions = inject('SettingsDisplayOptions');

        // hud
        const HudEnabled = inject('HudEnabled');
        const HudEnabledOptions = inject('HudEnabledOptions');
        const HudDisplay = inject('HudDisplay');
        const HudDisplayOptions = inject('HudDisplayOptions');

        // autodirector
        // const AutoDirectorEnabled = inject('AutoDirectorEnabled');
        // const AutoDirectorEnabledOptions = inject('AutoDirectorEnabledOptions');
        // const AutoDirectorDisplay = inject('AutoDirectorDisplay');
        // const AutoDirectorDisplayOptions = inject('AutoDirectorDisplayOptions');

        // director
        const DirectorEnabled = inject('DirectorEnabled');
        const DirectorEnabledOptions = inject('DirectorEnabledOptions');
        const DirectorDisplay = inject('DirectorDisplay');
        const DirectorDisplayOptions = inject('DirectorDisplayOptions');
        const DirectorDefaultView = inject('DirectorDefaultView');
        const DirectorDefaultViewOptions = inject('DirectorDefaultViewOptions');
        const DirectorCommandAuto = inject('DirectorCommandAuto');
        const DirectorCommandBlank = inject('DirectorCommandBlank');
        const DirectorCommandSolo = inject('DirectorCommandSolo');
        const DirectorCommandLeaderboard = inject('DirectorCommandLeaderboard');
        const DirectorCommandStandings = inject('DirectorCommandStandings');
        const DirectorCommandBattle = inject('DirectorCommandBattle');

        return {
            SettingsOnStartup,
            SettingsOnStartupOptions,
            Debug,
            DebugOptions,

            Developer,
            MockFetch,
            MockFetchOptions,
            MockState,
            MockStateOptions,

            ExternalCrest,
            ExternalCrestOptions,
            IP,
            Port,
            TickRate,
            Connected,

            SettingsDisplay,
            SettingsDisplayOptions,

            HudEnabled,
            HudEnabledOptions,
            HudDisplay,
            HudDisplayOptions,

            // AutoDirectorEnabled,
            // AutoDirectorEnabledOptions,
            // AutoDirectorDisplay,
            // AutoDirectorDisplayOptions,

            DirectorEnabled,
            DirectorEnabledOptions,
            DirectorDisplay,
            DirectorDisplayOptions,
            DirectorDefaultView,
            DirectorDefaultViewOptions,
            DirectorCommandAuto,
            DirectorCommandBlank,
            DirectorCommandSolo,
            DirectorCommandLeaderboard,
            DirectorCommandStandings,
            DirectorCommandBattle,
        }
    },
    components: {
        SettingInputComponent,
        SettingKeyPressComponent,
        SettingButtonComponent,
        SettingToggleComponent
    },
    data() {
        const isUpdateAvailable = null;

        return {
            isUpdateAvailable
        }
    },
    computed: {
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
        // activeHudDisplay: {
        //     get() {
        //         return true;
        //     },
        //     set(value) {
        //         return true;
        //     }
        // },
        // activeHudDisplayOptions: {
        //     get() {
        //         return [
        //             { label: 'Farts', value: true }
        //         ];
        //     },
        //     set(value) {
        //         return true;
        //     }
        // }
    },
    methods: {
        // changeWindowDisplay(win, id) {
        //     electron.ipcRenderer.invoke('changeWindowDisplay', win, id);
        //     return id;
        // },
        async hideSettings() {
            await electron.ipcRenderer.invoke('closeWindow', 'SettingsWindow');
        },
        // async openSettings() {
        //     return this.open = true;
        // },
        // exitApp() {
        //     electron.ipcRenderer.invoke('quit');
        // },
        // updateMouseState(active) {
        //     electron.ipcRenderer.invoke('disableMouse');
        //     if (active) {
        //         electron.ipcRenderer.invoke('enableMouse');
        //     }
        // },
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
