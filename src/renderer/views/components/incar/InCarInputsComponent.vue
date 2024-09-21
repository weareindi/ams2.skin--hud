<template>
    <div class="c-in-car-inputs">
        <div class="c-in-car-inputs__cols">
            <div class="c-in-car-inputs__col">
                <div class="c-in-car-inputs__rows">
                    <div class="c-in-car-inputs__row">
                        <div class="c-in-car-inputs__items">
                            <div class="c-in-car-inputs__item" v-for="item in vInputSteering">
                                <InCarDataSteeringComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-inputs__row">
                        <div class="c-in-car-inputs__items">
                            <div class="c-in-car-inputs__item" v-for="item in vInputClutch">
                                <InCarDataLevelComponent :data="item" />
                            </div>
                            <div class="c-in-car-inputs__item" v-for="item in vInputBrake">
                                <InCarDataLevelComponent :data="item" />
                            </div>
                            <div class="c-in-car-inputs__item" v-for="item in vInputThrottle">
                                <InCarDataLevelComponent :data="item" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="c-in-car-inputs__footer">
            <InCarIconComponent svg="icon--pedals" />
        </div>
    </div>
</template>

<style lang="scss">

.c-in-car-inputs {
    display: flex;
    flex-direction: column;
}

.c-in-car-inputs__cols {
    display: flex;
    // flex-direction: row;
}

.c-in-car-inputs__col {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    + .c-in-car-inputs__col {
        margin: 0 0 0 em(24);
    }
}

.c-in-car-inputs__rows {
    margin: em(-8);
}

.c-in-car-inputs__row {
    padding: em(8);
}

.c-in-car-inputs__items {
    display: flex;
}

.c-in-car-inputs__item {
    width: 100%;

    + .c-in-car-inputs__item {
        margin: 0 0 0 em(14);
    }
}

.c-in-car-inputs__footer {
    margin: em(16) 0 0;
    display: flex;
    justify-content: center;
}

.c-in-car-inputs__icon {}

</style>

<script>
import { inject } from 'vue';
import InCarDataSteeringComponent from './InCarDataSteeringComponent.vue';
import InCarDataLevelComponent from './InCarDataLevelComponent.vue';
import InCarIconComponent from './InCarIconComponent.vue';

export default {
    setup() {
        const vInputSteering = inject('vInputSteering');
        const vInputClutch = inject('vInputClutch');
        const vInputBrake = inject('vInputBrake');
        const vInputThrottle = inject('vInputThrottle');

        return {
            vInputSteering,
            vInputClutch,
            vInputBrake,
            vInputThrottle,
        };
    },
    components: {
        InCarDataSteeringComponent,
        InCarDataLevelComponent,
        InCarIconComponent
    }
}
</script>
