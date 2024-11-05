<template>
    <div class="c-hud-incar">
        <div class="c-hud-incar__top">
            <div class="c-hud-incar__a"><InCarStandingsComponent /></div>
            <div class="c-hud-incar__b"></div>
            <div class="c-hud-incar__c"></div>
        </div>
        <div class="c-hud-incar__middle">
            <div class="c-hud-incar__a"></div>
            <div class="c-hud-incar__b">
                <div class="c-hud-incar__rows">
                    <div class="c-hud-incar__row">
                        <div class="c-hud-incar__items">
                            <div class="c-hud-incar__item">
                                <InCarSplitComponent :data="vSplitTimeAhead" />
                            </div>
                            <div class="c-hud-incar__item">
                                <InCarSplitComponent :data="vSplitTime" />
                            </div>
                            <div class="c-hud-incar__item">
                                <InCarSplitComponent :data="vSplitTimeBehind" inverted="true" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-hud-incar__c"></div>
        </div>
        <div class="c-hud-incar__bottom">
            <div class="c-hud-incar__a">
                <div class="c-hud-incar__rows">
                    <div class="c-hud-incar__row">
                        <div class="c-hud-incar__items">
                            <div class="c-hud-incar__item">
                                <InCarEventComponent />
                            </div>
                        </div>
                    </div>
                    <div class="c-hud-incar__row">
                        <div class="c-hud-incar__items">
                            <div class="c-hud-incar__item">
                                <InCarFuelComponent />
                            </div>
                            <div class="c-hud-incar__item">
                                <InCarInputsComponent />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-hud-incar__b">
                <div class="c-hud-incar__rows">
                    <div class="c-hud-incar__row">
                        <div class="c-hud-incar__items">
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-hud-incar__c">
                <div class="c-hud-incar__rows">
                    <div class="c-hud-incar__row">
                        <div class="c-hud-incar__items">
                            <div class="c-hud-incar__center">
                                <div class="c-hud-incar__item c-hud-incar__item--speedometer">
                                    <InCarSpeedometerComponent />
                                </div>
                                <div class="c-hud-incar__item c-hud-incar__item--features c-hud-incar__item--float-right">
                                    <InCarFeaturesComponent />
                                </div>
                            </div>
                            <div class="c-hud-incar__item c-hud-incar__item--wheelstyres">
                                <InCarWheelsTyresComponent />
                            </div>
                        </div>
                    </div>
                    <div class="c-hud-incar__row">
                        <div class="c-hud-incar__items">
                            <div class="c-hud-incar__item" v-if="vABS" v-for="item in vABS">
                                <InCarDataIconValueComponent :data="item" icon="icon--abs" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vTC" v-for="item in vTC">
                                <InCarDataIconValueComponent :data="item" icon="icon--tc" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vTrackTemperature" v-for="item in vTrackTemperature">
                                <InCarDataIconValueComponent :data="item" icon="icon--circuit" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vAmbientTemperature" v-for="item in vAmbientTemperature">
                                <InCarDataIconValueComponent :data="item" icon="icon--air" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vWeather" v-for="item in vWeather">
                                <InCarDataWeatherComponent :data="item" icon="icon--weather" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vAero" v-for="item in vAero">
                                <InCarDataIconValueComponent :data="item" icon="icon--aero" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vClutch" v-for="item in vClutch">
                                <InCarDataIconValueComponent :data="item" icon="icon--clutch" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vEngine" v-for="item in vEngine">
                                <InCarDataIconValueComponent :data="item" icon="icon--engine" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vWaterTemp" v-for="item in vWaterTemp">
                                <InCarDataIconValueComponent :data="item" icon="icon--water-temp" />
                            </div>
                            <div class="c-hud-incar__item" v-if="vOilTemp" v-for="item in vOilTemp">
                                <InCarDataIconValueComponent :data="item" icon="icon--oil" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-hud-incar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.c-hud-incar__item--speedometer,
.c-hud-incar__item--features {
    align-self: flex-end;
}

.c-hud-incar__item--wheelstyres {
    margin: 0 0 em(16);
}


.c-hud-incar__top,
.c-hud-incar__middle,
.c-hud-incar__bottom {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
}

.c-hud-incar__top {
    align-items: flex-start;
    padding: em(32) 0 0;

    .c-hud-incar__a {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
        padding: 0 em(32);
    }

}

.c-hud-incar__middle {
    align-items: flex-start;
    min-height: em(420);

    .c-hud-incar__b {
        width: em(680);

        .c-hud-incar__items {
        }

        .c-hud-incar__item {
            display: flex;
            align-items: center;

            width: calc(100% / 3);

            &:nth-of-type(1) {
                justify-content: flex-start;
            }

            &:nth-of-type(2) {
                justify-content: center;
            }

            &:nth-of-type(3) {
                justify-content: flex-end;
            }
        }
    }
}

.c-hud-incar__bottom {
    align-items: flex-end;
    padding: 0 0 em(32);

    .c-hud-incar__a {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;

        width: em(384);
        padding: 0 em(32);
    }

    .c-hud-incar__c {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;

        width: em(1136);
        padding: 0 em(32) 0 em(32);

        .c-hud-incar__rows {
            margin: em(-16);
        }

        .c-hud-incar__row {
            padding: em(16);

            // wheels and tyres aligned right
            &:nth-of-type(1) {
                .c-hud-incar__items {
                    justify-content: flex-end;
                }
            }
        }
    }
}

.c-hud-incar__a,
.c-hud-incar__b,
.c-hud-incar__c {
    position: relative;
}

.c-hud-incar__a {}

.c-hud-incar__b {}

.c-hud-incar__c {}

.c-hud-incar__rows {
    margin: em(-32);
}

.c-hud-incar__row {
    padding: em(32);
}


.c-hud-incar__items {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
}

.c-hud-incar__item {}

.c-hud-incar__center {
    position: fixed;
    left: 50vw;
    transform: translateX(-50%);
}

.c-hud-incar__item--float-right {
    position: absolute;
    left: 100%;
    bottom: 0;
    padding: 0 0 0 em(64);
}

</style>

<script>
import { inject } from 'vue';
import InCarStandingsComponent from '../components/incar/InCarStandingsComponent.vue';
import InCarEventComponent from '../components/incar/InCarEventComponent.vue';
import InCarFuelComponent from '../components/incar/InCarFuelComponent.vue';
import InCarInputsComponent from '../components/incar/InCarInputsComponent.vue';
import InCarDataIconValueComponent from '../components/incar/InCarDataIconValueComponent.vue';
import InCarDataWeatherComponent from '../components/incar/InCarDataWeatherComponent.vue';
import InCarSpeedometerComponent from '../components/incar/InCarSpeedometerComponent.vue';
import InCarFeaturesComponent from '../components/incar/InCarFeaturesComponent.vue';
import InCarWheelsTyresComponent from '../components/incar/InCarWheelsTyresComponent.vue';
import InCarSplitComponent from '../components/incar/InCarSplitComponent.vue';

export default {
    setup() {
        const vABS = inject('vABS');
        const vTC = inject('vTC');
        const vTrackTemperature = inject('vTrackTemperature');
        const vAmbientTemperature = inject('vAmbientTemperature');
        const vWeather = inject('vWeather');
        const vAero = inject('vAero');
        const vClutch = inject('vClutch');
        const vEngine = inject('vEngine');
        const vWaterTemp = inject('vWaterTemp');
        const vOilTemp = inject('vOilTemp');

        const vDistanceAhead = inject('vDistanceAhead');
        const vDistanceBehind = inject('vDistanceBehind');
        const vSplitTimeAhead = inject('vSplitTimeAhead');
        const vSplitTimeBehind = inject('vSplitTimeBehind');
        const vSplitTime = inject('vSplitTime');

        return {
            vABS,
            vTC,
            vTrackTemperature,
            vAmbientTemperature,
            vWeather,
            vAero,
            vClutch,
            vEngine,
            vWaterTemp,
            vOilTemp,
            vDistanceAhead,
            vDistanceBehind,
            vSplitTimeAhead,
            vSplitTimeBehind,
            vSplitTime,
        };
    },
    components: {
        InCarStandingsComponent,
        InCarEventComponent,
        InCarFuelComponent,
        InCarInputsComponent,
        InCarDataIconValueComponent,
        InCarDataWeatherComponent,
        InCarSpeedometerComponent,
        InCarFeaturesComponent,
        InCarWheelsTyresComponent,
        InCarSplitComponent,
    }
}
</script>
