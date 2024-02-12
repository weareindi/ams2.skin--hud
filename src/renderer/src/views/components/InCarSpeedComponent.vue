<template>
    <div class="c-in-car-speed" v-if="mSpeedDisplay !== null">
        <span class="c-in-car-speed__zerofill" v-if="zerofill">{{ zerofill }}</span>
        <span class="c-in-car-speed__value">{{ mSpeedDisplay }}</span>
    </div>
</template>

<style lang="scss">
.c-in-car-speed {
    display: flex;
    align-items: center;
    padding: em(12);
    border-radius: em(3);
}

.c-in-car-speed__zerofill {
    opacity: 0.2;
}

.c-in-car-speed__zerofill,
.c-in-car-speed__value {
    font-family: 'firacode', monospace;
    font-size: em(32);
    line-height: 1em;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const mSpeedDisplay = inject('mSpeedDisplay');

        return {
            mSpeedDisplay,
        }
    },
    computed: {
        zerofill() {
            const valueString = `${this.mSpeedDisplay}`;
            return ('00000').substring(0, 3).slice(valueString.length);
        },
    }
}
</script>
