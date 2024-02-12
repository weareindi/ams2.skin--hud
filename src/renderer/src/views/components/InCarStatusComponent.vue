<template>
    <div class="c-in-car-status">
        <div class="c-in-car-status__items">
            <div class="c-in-car-status__item" v-if="oil">
                <InCarStatComponent icon="oil" :right="oil" />
            </div>
            <div class="c-in-car-status__item" v-if="water">
                <InCarStatComponent icon="water-temp" :right="water" />
            </div>
            <div class="c-in-car-status__item" v-if="tc">
                <InCarStatComponent icon="tc" :right="tc" :state="tcState" />
            </div>
            <div class="c-in-car-status__item" v-if="abs">
                <InCarStatComponent icon="abs" :right="abs" :state="absState" />
            </div>
            <div class="c-in-car-status__item" v-if="pedals">
                <InCarStatComponent icon="pedals" :right="pedals" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-status {
        @include color('background-color', 'pitbox', 0.8);

        display: flex;
        overflow: hidden;
        padding: em(4);
        border-radius: em(8);
    }

    .c-in-car-status__items {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
    }

    .c-in-car-status__item {
        display: flex;
    }
</style>

<script>
import { inject } from 'vue';
import InCarStatComponent from '../components/InCarStatComponent.vue';

export default {
    setup() {
        const mOilTempCelsiusDisplay = inject('mOilTempCelsiusDisplay');
        const mWaterTempCelsiusDisplay = inject('mWaterTempCelsiusDisplay');
        const mAntiLockActiveDisplay = inject('mAntiLockActiveDisplay');
        const mAntiLockSettingDisplay = inject('mAntiLockSettingDisplay');
        const mTractionControlSettingDisplay = inject('mTractionControlSettingDisplay');
        const mClutchDisplay = inject('mClutchDisplay');
        const mBrakeDisplay = inject('mBrakeDisplay');
        const mThrottleDisplay = inject('mThrottleDisplay');
        const isTractionControlActiveDisplay = inject('isTractionControlActiveDisplay');
        
        const skeleton = {
            a: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null,
            },
            b: {
                value: null,
                suffix: null,
                monospace: false,
                zerofill: null
            }
        }

        return {
            mOilTempCelsiusDisplay,
            mWaterTempCelsiusDisplay,
            mAntiLockActiveDisplay,
            mAntiLockSettingDisplay,
            mTractionControlSettingDisplay,
            mClutchDisplay,
            mBrakeDisplay,
            mThrottleDisplay,
            isTractionControlActiveDisplay,
            skeleton
        }
    },
    components: {
        InCarStatComponent
    },
    computed: {
        oil() {
            if (!this.mOilTempCelsiusDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mOilTempCelsiusDisplay;
            data.a.suffix = '°';
            data.a.monospace = true;

            return {a: data};
        },
        water() {
            if (!this.mWaterTempCelsiusDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mWaterTempCelsiusDisplay;
            data.a.suffix = '°';
            data.a.monospace = true;

            return {a: data};
        },
        tc() {
            if (!this.mTractionControlSettingDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mTractionControlSettingDisplay;
            // data.a.suffix = '°';
            data.a.monospace = true;

            return {a: data};
        },
        tcState() {
            if (!this.isTractionControlActiveDisplay) {
                return null;
            }

            return 'blue';
        },
        abs() {
            if (!this.mAntiLockSettingDisplay) {
                return null;
            }

            let data = JSON.parse(JSON.stringify(this.skeleton));

            // update data
            data.a.value = this.mAntiLockSettingDisplay;
            // data.a.suffix = '°';
            data.a.monospace = true;

            return {a: data};
        },
        absState() {
            if (!this.mAntiLockActiveDisplay) {
                return null;
            }
            
            return 'yellow';
        },
        pedals() {
            if (!this.mClutchDisplay && !this.mBrakeDisplay && !this.mThrottleDisplay) {
                return null;
            }

            let clutch = JSON.parse(JSON.stringify(this.skeleton));
            let brake = JSON.parse(JSON.stringify(this.skeleton));
            let throttle = JSON.parse(JSON.stringify(this.skeleton));

            // clutch data
            clutch.a.value = this.mClutchDisplay;
            clutch.a.zerofill = 3;
            clutch.a.monospace = true;

            // brake data
            brake.a.value = this.mBrakeDisplay;
            brake.a.zerofill = 3;
            brake.a.monospace = true;

            // throttle data
            throttle.a.value = this.mThrottleDisplay;
            throttle.a.zerofill = 3;
            throttle.a.monospace = true;

            return {a: clutch, b: brake, c: throttle};
        },
    },
}
</script>
