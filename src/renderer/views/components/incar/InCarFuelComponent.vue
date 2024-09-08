<template>
    <div class="c-in-car-fuel">
        <div class="c-in-car-fuel__cols">
            <div class="c-in-car-fuel__col">
                <div class="c-in-car-fuel__rows">
                    <div class="c-in-car-fuel__row">
                        <div class="c-in-car-fuel__items">
                            <div class="c-in-car-fuel__item c-in-car-fuel__item--level" v-for="item in vFuelLevel">
                                <InCarDataLevelComponent :data="item" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-in-car-fuel__col">
                <TransitionGroup tag="div" name="fade" class="c-in-car-fuel__rows">
                    <div class="c-in-car-fuel__row" v-if="vFuelInCar">
                        <div class="c-in-car-fuel__items">
                            <div class="c-in-car-fuel__item" v-for="item in vFuelInCar">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-fuel__row" v-if="vFuelPerLap">
                        <div class="c-in-car-fuel__items">
                            <div class="c-in-car-fuel__item" v-for="item in vFuelPerLap">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-fuel__row" v-if="vFuelToEndSession">
                        <div class="c-in-car-fuel__items">
                            <div class="c-in-car-fuel__item" v-for="item in vFuelToEndSession">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-fuel__row" v-if="vFuelStopsToEndSession">
                        <div class="c-in-car-fuel__items">
                            <div class="c-in-car-fuel__item" v-for="item in vFuelStopsToEndSession">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-fuel__row" v-if="vFuelInStop">
                        <div class="c-in-car-fuel__items">
                            <div class="c-in-car-fuel__item" v-for="item in vFuelInStop">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
        <div class="c-in-car-fuel__footer">
            <InCarIconComponent svg="icon--fuel" />
        </div>
    </div>
</template>

<style lang="scss">

.c-in-car-fuel {
    display: flex;
    flex-direction: column;
}

.c-in-car-fuel__cols {
    display: flex;
}

.c-in-car-fuel__col {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    + .c-in-car-fuel__col {
        margin: 0 0 0 em(24);
    }
}

.c-in-car-fuel__rows {
    display: flex;
    flex-direction: column;
}

.c-in-car-fuel__row {
    display: flex;
}

.c-in-car-fuel__items {
    display: flex;
}

.c-in-car-fuel__item {
    display: flex;
    padding: 2px 0 0;
}

.c-in-car-fuel__item--level {
    justify-content: center;
    width: em(32);
}

.c-in-car-fuel__footer {
    margin: em(16) 0 0;
    display: flex;
}

.c-in-car-fuel__icon {}

</style>

<script>
import { inject } from 'vue';
import InCarDataLevelComponent from './InCarDataLevelComponent.vue';
import InCarDataTextComponent from './InCarDataTextComponent.vue';
import InCarIconComponent from './InCarIconComponent.vue';

export default {
    setup() {
        const vFuelLevel = inject('vFuelLevel');
        const vFuelInCar = inject('vFuelInCar');
        const vFuelPerLap = inject('vFuelPerLap');
        const vFuelToEndSession = inject('vFuelToEndSession');
        const vFuelStopsToEndSession = inject('vFuelStopsToEndSession');
        const vFuelInStop = inject('vFuelInStop');

        return {
            vFuelLevel,
            vFuelInCar,
            vFuelPerLap,
            vFuelToEndSession,
            vFuelStopsToEndSession,
            vFuelInStop,
        };
    },
    components: {
        InCarDataLevelComponent,
        InCarDataTextComponent,
        InCarIconComponent
    }
}
</script>
