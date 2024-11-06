<template>
    <div class="c-in-car-timings">
        <div class="c-in-car-timings__cols">
            <div class="c-in-car-timings__col">
                <InCarIconComponent svg="icon--stopwatch" />
            </div>
            <div class="c-in-car-timings__col">
                <div class="c-in-car-timings__rows">
                    <div class="c-in-car-timings__row" v-for="data in vTimings">
                        <div class="c-in-car-timings__times">
                            <span class="c-in-car-timings__label" v-if="data[0]" v-html="data[0].label"></span>
                            <span class="c-in-car-timings__time" v-html="item.value" v-for="item, timeIndex in data" :timeIndex></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.c-in-car-timings {
    display: flex;
    flex-direction: row-reverse;
}

.c-in-car-timings__cols {
    display: flex;
    // flex-direction: row;
}

.c-in-car-timings__col {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    + .c-in-car-timings__col {
        margin: 0 0 0 em(24);
    }
}

.c-in-car-timings__rows {
    display: flex;
    flex-direction: column;
}

.c-in-car-timings__row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: em(2) em(8);
    border-radius: em(4);

    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.4));

    + .c-in-car-timings__row {
        margin: em(2) 0 0 0;
    }
}

.c-in-car-timings__times {
    position: relative;
    z-index: 2;

    width: 100%;
    display: flex;
    // grid-template-columns: repeat(5, 1fr);
    // flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: em(16);
}

.c-in-car-timings__label {
    // flex-grow: 1;
    // flex-shrink: 0;
    // flex-basis: auto;

    text-align: left;
    min-width: 9ch;
}

.c-in-car-timings__time {
    // flex-grow: 0;
    // flex-shrink: 0;
    // flex-basis: auto;
    // min-width: 10ch;
    min-width: 9ch;

    &[timeIndex="1"],
    &[timeIndex="2"],
    &[timeIndex="3"] {
        opacity: 0.6;
    }
}

.c-in-car-timings__label,
.c-in-car-timings__time {
    font-size: em(14);
}
</style>

<script>
import InCarIconComponent from './InCarIconComponent.vue';
import { inject } from 'vue';

export default {
    setup() {
        const vTimings = inject('vTimings');

        return {
            vTimings
        }
    },
    components: {
        InCarIconComponent
    }
}
</script>
