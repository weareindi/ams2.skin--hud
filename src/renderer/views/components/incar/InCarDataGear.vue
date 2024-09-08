<template>
    <div class="c-in-car-data-gear" v-for="item in vGear">
        <span class="c-in-car-data-gear__label">{{ item.value }}</span>
    </div>
</template>

<style lang="scss">
.c-in-car-data-gear {}

.c-in-car-data-gear__label {
    font-family: "uifont", sans-serif;
    font-size: em(58);
    line-height: 1em;
    text-transform: uppercase;
    letter-spacing: 0;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const vGear = inject('vGear');

        return {
            vGear,
        };
    }
}
</script>
