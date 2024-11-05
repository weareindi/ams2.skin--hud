<template>
    <div class="c-in-car-standings">
        <div class="c-in-car-standings__cols">
            <div class="c-in-car-standings__col">
                <InCarIconComponent svg="icon--chequered-flag" />
            </div>
            <div class="c-in-car-standings__col">
                <div class="c-in-car-standings__rows">
                    <div class="c-in-car-standings__row" v-for="data in vTrackPosition" :state="data[0].state">
                        <div class="c-in-car-standings__participant">
                            <span class="c-in-car-standings__position" v-if="data[1]">
                                <span>{{ data[1].zerofill }}</span>
                                <span>{{ data[1].value }}</span>
                            </span>
                            <span class="c-in-car-standings__state"></span>
                            <span class="c-in-car-standings__tag" v-if="data[2] && data[2].label">
                                <span>{{ data[2].label }}</span>
                            </span>
                            <span class="c-in-car-standings__name" v-if="data[3]">
                                <span>{{ data[3].label }}</span>
                            </span>
                        </div>
                        <div class="c-in-car-standings__values">
                            <div class="c-in-car-standings__value" v-if="data[4]">
                                <span class="c-in-car-standings__time" :state="data[4].state">{{ data[4].value }}</span>
                            </div>
                            <div class="c-in-car-standings__value" v-if="data[5]">
                                <span class="c-in-car-standings__distance">{{ data[5].value }} <span class="c-in-car-standings__suffix">{{ data[5].seperator }} {{ data[5].suffix }}</span></span>
                            </div>
                            <div class="c-in-car-standings__value" v-if="data[6] && data[6].label">
                                <span class="c-in-car-standings__distance">{{ data[6].label }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.c-in-car-standings {
    display: flex;
    flex-direction: row-reverse;
}

.c-in-car-standings__cols {
    display: flex;
    // flex-direction: row;
}

.c-in-car-standings__col {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    + .c-in-car-standings__col {
        margin: 0 0 0 em(24);
    }
}

.c-in-car-standings__rows {
    display: flex;
    flex-direction: column;
}

.c-in-car-standings__row {
    position: relative;
    display: flex;
    padding: em(2) em(8);
    border-radius: em(4);

    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.4));

    + .c-in-car-standings__row {
        margin: em(2) 0 0 0;
    }

    // driver
    &[state="0"] {
        @include color('background-color', 'white', 1);
        @include color('color', 'black', 1);

        filter: none;


    }

    // out lap
    &[state="1"] {
        .c-in-car-standings__state {
            @include color('background-color', 'blue', 1);
        }
    }

    // hot lap
    &[state="2"] {
        .c-in-car-standings__state {
            @include color('background-color', 'red', 1);
        }
    }

    // ahead
    &[state="3"] {
        .c-in-car-standings__state {
            @include color('background-color', 'green', 1);
        }
    }

    // behind
    &[state="4"] {
        .c-in-car-standings__state {
            @include color('background-color', 'green', 1);
        }
    }

    // leader (driver is backmarker)
    &[state="5"] {
        .c-in-car-standings__state {
            @include color('background-color', 'red', 1);
        }
    }

    // backmarker
    &[state="6"] {
        .c-in-car-standings__state {
            @include color('background-color', 'blue', 1);
        }
    }
}

.c-in-car-standings__participant {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: em(16);
}

.c-in-car-standings__position {}

.c-in-car-standings__state {
    width: em(4);
    height: 100%;
}

.c-in-car-standings__tag {
    @include color('background-color', 'white', 0.2);

    display: flex;
    align-items: center;
    justify-content: center;
    padding: em(2) em(4);
    border-radius: em(4);
    min-width: calc(4ch + em(4 * 2));
}

.c-in-car-standings__name {
    width: em(120);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.c-in-car-standings__values {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: em(16);
}

.c-in-car-standings__value {
    position: relative;
    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: center;
}

.c-in-car-standings__time {
    min-width: 12ch;
    text-align: center;

    &[state="0"] {}

    &[state="1"] {}

    &[state="2"] {
        animation-name: flash;
        animation-duration: 150ms;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
    }

    &[state="3"] {
        @include color('color', 'green', 1);
    }
}

.c-in-car-standings__distance {
    min-width: 8ch;
}
</style>

<script>
import InCarIconComponent from './InCarIconComponent.vue';
import { inject } from 'vue';

export default {
    setup() {
        const vTrackPosition = inject('vTrackPosition');

        return {
            vTrackPosition
        }
    },
    components: {
        InCarIconComponent
    }
}
</script>
