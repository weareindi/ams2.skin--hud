<template>
    <div class="c-in-car-gear" v-if="mGearDisplay">
        <span class="c-in-car-gear__value" v-if="mGearDisplay.value">{{ mGearDisplay.value }}</span>
    </div>
</template>

<style lang="scss">
.c-in-car-gear {
    display: flex;
    align-items: center;
}

.c-in-car-gear__zerofill {
    opacity: 0.2;
}

.c-in-car-gear__zerofill,
.c-in-car-gear__value {
    font-family: 'firacode', monospace;
    font-size: em(54);
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
    }
}
</script>
