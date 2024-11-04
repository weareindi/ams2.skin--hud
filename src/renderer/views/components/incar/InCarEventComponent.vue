<template>
    <div class="c-in-car-event">
        <div class="c-in-car-event__cols">
            <div class="c-in-car-event__col">
                <InCarIconComponent svg="icon--stopwatch" />
            </div>
            <div class="c-in-car-event__col">
                <TransitionGroup tag="div" name="fade" class="c-in-car-event__rows">
                    <div class="c-in-car-event__row" v-if="vEventTimeRemaining">
                        <div class="c-in-car-event__items">
                            <div class="c-in-car-event__item" v-for="item in vEventTimeRemaining">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-event__row" v-if="vCurrentLap">
                        <div class="c-in-car-event__items">
                            <div class="c-in-car-event__item" v-for="item in vCurrentLap">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-event__row" v-if="vCurrentPosition">
                        <div class="c-in-car-event__items">
                            <div class="c-in-car-event__item" v-for="item in vCurrentPosition">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                    <div class="c-in-car-event__row" v-if="vClassPosition">
                        <div class="c-in-car-event__items">
                            <div class="c-in-car-event__item" v-for="item in vClassPosition">
                                <InCarDataTextComponent :data="item" />
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.c-in-car-event {
    display: flex;
    flex-direction: row-reverse;
}

.c-in-car-event__cols {
    display: flex;
    // flex-direction: row;
}

.c-in-car-event__col {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    + .c-in-car-event__col {
        margin: 0 0 0 em(24);
    }
}

.c-in-car-event__rows {
    display: flex;
    flex-direction: column;
}

.c-in-car-event__row {
    display: flex;
}

.c-in-car-event__items {
    display: flex;
}

.c-in-car-event__item {
    display: flex;
    padding: 2px 0 0;
}

.c-in-car-event__item--level {
    justify-content: center;
    width: em(32);
}

.c-in-car-event__footer {
    margin: em(16) 0 0;
    display: flex;
    // justify-content: flex-start;
    // flex-direction: row;
}

.c-in-car-event__icon {}

</style>

<script>
import { inject } from 'vue';
import InCarDataTextComponent from './InCarDataTextComponent.vue';
import InCarIconComponent from './InCarIconComponent.vue';

export default {
    setup() {
        const vEventTimeRemaining = inject('vEventTimeRemaining');
        const vCurrentLap = inject('vCurrentLap');
        const vCurrentPosition = inject('vCurrentPosition');
        const vClassPosition = inject('vClassPosition');

        return {
            vEventTimeRemaining,
            vCurrentLap,
            vCurrentPosition,
            vClassPosition,
        };
    },
    components: {
        InCarDataTextComponent,
        InCarIconComponent
    }
}
</script>
