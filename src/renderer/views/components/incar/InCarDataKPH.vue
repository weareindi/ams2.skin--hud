<template>
    <div class="c-in-car-data-kph">
        <span class="c-in-car-data-kph__items">
            <span class="c-in-car-data-kph__item" v-for="item in vKPH">
                <span class="c-in-car-data-kph__value">{{ item.value }}</span>
                <span class="c-in-car-data-kph__label">{{ item.label }}</span>
            </span>
        </span>
    </div>
</template>

<style lang="scss">
.c-in-car-data-kph {}

.c-in-car-data-kph__items {}

.c-in-car-data-kph__item {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.c-in-car-data-kph__value {
    display: block;
    font-family: "uifont", sans-serif;
    font-size: em(30);
    line-height: 1em;
    text-transform: uppercase;
    letter-spacing: 0;
}

.c-in-car-data-kph__label {
    display: block;
    font-family: "uifont", sans-serif;
    font-size: em(10);
    line-height: 1em;
    text-transform: uppercase;
    letter-spacing: 0;
    margin: em(10, 10) em(4, 10) 0 0;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const vKPH = inject('vKPH');

        return {
            vKPH,
        };
    }
}
</script>

