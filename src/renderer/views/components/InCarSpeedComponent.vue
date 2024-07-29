<template>
    <div class="c-in-car-speed" v-if="mSpeedDisplay">
        <div class="c-in-car-speed__amount">
            <span class="c-in-car-speed__zerofill" v-if="mSpeedDisplay.zerofill">{{ mSpeedDisplay.zerofill }}</span>
            <span class="c-in-car-speed__value" v-if="mSpeedDisplay.value">{{ mSpeedDisplay.value }}</span>
        </div>
        <div class="c-in-car-speed__suffix" v-if="mSpeedDisplay.suffix">{{ mSpeedDisplay.suffix }}</div>
    </div>
</template>

<style lang="scss">
.c-in-car-speed {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.c-in-car-speed__amount {}

.c-in-car-speed__zerofill,
.c-in-car-speed__value {
    font-family: 'firacode', monospace;
    font-size: em(32);
    line-height: 1em;
}

.c-in-car-speed__zerofill {
    opacity: 0.1;
}

.c-in-car-speed__suffix {
    font-size: em(12);
    opacity: 0.4;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const mSpeedDisplay = inject('mSpeedDisplay');

        return {
            mSpeedDisplay
        }
    },
}
</script>
