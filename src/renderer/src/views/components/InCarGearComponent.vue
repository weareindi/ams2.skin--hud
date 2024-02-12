<template>
    <div class="c-in-car-gear" v-if="mGearDisplay !== null">
        <span class="c-in-car-gear__zerofill" v-if="zerofill">{{ zerofill }}</span>
        <span class="c-in-car-gear__value">{{ mGearDisplay }}</span>
    </div>
</template>

<style lang="scss">
.c-in-car-gear {
    display: flex;
    align-items: center;
    padding: em(12);
    border-radius: em(3);
}

.c-in-car-gear__zerofill {
    opacity: 0.2;
}

.c-in-car-gear__zerofill,
.c-in-car-gear__value {
    font-family: 'firacode', monospace;
    font-size: em(58);
    line-height: 0.8;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const mGearDisplay = inject('mGearDisplay');

        return {
            mGearDisplay,
        }
    },
    computed: {
        zerofill: {
            get() {
                const valueString = `${this.mGearDisplay}`;
                return ('0').substring(0, 1).slice(valueString.length);
            }
        },
    }
}
</script>
