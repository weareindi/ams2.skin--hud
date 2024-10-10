<template>
    <div class="c-in-car-data-gear" v-for="item in vGear">
        <span class="c-in-car-data-gear__label">{{ item.value }}</span>
    </div>
</template>

<style lang="scss">
.c-in-car-data-gear {}

.c-in-car-data-gear__label {
    font-size: em(90);
    line-height: 1em;
    text-transform: uppercase;
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
