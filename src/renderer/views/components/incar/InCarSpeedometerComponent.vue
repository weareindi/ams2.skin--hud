<template>
    <div class="c-in-car-speedometer">
        <div class="c-in-car-speedometer__rows">
            <div class="c-in-car-speedometer__row">
                <div class="c-in-car-speedometer__items">
                    <div class="c-in-car-speedometer__item">
                        <InCarDataTachometerComponent />
                    </div>
                </div>
            </div>
            <div class="c-in-car-speedometer__row">
                <div class="c-in-car-speedometer__items">
                    <div class="c-in-car-speedometer__item">
                        <InCarDataKPH />
                    </div>
                    <div class="c-in-car-speedometer__item">
                        <InCarDataGear />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-speedometer {}

.c-in-car-speedometer__rows {}

.c-in-car-speedometer__row {
    ~ .c-in-car-speedometer__row {
        margin: em(16) 0 0;
    }
}

.c-in-car-speedometer__items {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 em(-24);
}

.c-in-car-speedometer__item {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 em(24);
    width: 50%;

    + .c-in-car-speedometer__item {
        justify-content: flex-start;

        &:before {
            @include color('background-color', 'white', 0.4);

            content: '';

            position: absolute;
            top: em(16);
            left: -1px;
            bottom: em(8);
            width: 2px;
        }
    }
}
</style>

<script>
import InCarDataTachometerComponent from './InCarDataTachometerComponent.vue';
import InCarDataKPH from './InCarDataKPH.vue';
import InCarDataGear from './InCarDataGear.vue';

export default {
    components: {
        InCarDataTachometerComponent,
        InCarDataKPH,
        InCarDataGear,
    }
}
</script>
