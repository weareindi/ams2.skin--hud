<template>
    <div class="c-in-car-track-position">
        <div class="c-in-car-track-position__cols">
            <div class="c-in-car-track-position__col">
                <InCarIconComponent svg="icon--helmet" />
            </div>
            <div class="c-in-car-track-position__col">
                <div class="c-in-car-track-position__rows">
                    <div class="c-in-car-track-position__row" v-for="data in vTrackPosition" :state="data[0].state">
                        <div class="c-in-car-track-position__participant">
                            <span class="c-in-car-track-position__position" v-if="data[1]">
                                <span>{{ data[1].zerofill }}</span>
                                <span>{{ data[1].value }}</span>
                            </span>
                            <span class="c-in-car-track-position__state"></span>
                            <span class="c-in-car-track-position__tag">
                                <span v-if="data[2] && data[2].label">{{ data[2].label }}</span>
                            </span>
                            <span class="c-in-car-track-position__name">
                                <span v-if="data[3] && data[3].label">{{ data[3].label }}</span>
                            </span>
                        </div>
                        <div class="c-in-car-track-position__values">
                            <div class="c-in-car-track-position__value" v-if="data[4]">
                                <span class="c-in-car-track-position__time" :state="data[4].state">{{ data[4].value }}</span>
                            </div>
                            <div class="c-in-car-track-position__value" v-if="data[5]">
                                <span class="c-in-car-track-position__distance">{{ data[5].value }} <span class="c-in-car-track-position__suffix">{{ data[5].seperator }} {{ data[5].suffix }}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.c-in-car-track-position__position,
.c-in-car-track-position__state,
.c-in-car-track-position__tag,
.c-in-car-track-position__name,
.c-in-car-track-position__time,
.c-in-car-track-position__distance,
.c-in-car-track-position__pit {
    font-size: em(14);
}

.c-in-car-track-position {
    display: flex;
    flex-direction: row-reverse;
}

.c-in-car-track-position__cols {
    display: flex;
    // flex-direction: row;
}

.c-in-car-track-position__col {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    + .c-in-car-track-position__col {
        margin: 0 0 0 em(24 - 8);
    }
}

.c-in-car-track-position__rows {
    display: flex;
    flex-direction: column;
}

.c-in-car-track-position__row {
    position: relative;
    display: flex;
    padding: em(2) em(8);
    border-radius: em(4);

    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.4));

    + .c-in-car-track-position__row {
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
        .c-in-car-track-position__state {
            @include color('background-color', 'blue', 1);
        }
    }

    // hot lap
    &[state="2"] {
        .c-in-car-track-position__state {
            @include color('background-color', 'red', 1);
        }
    }

    // ahead
    &[state="3"] {
        .c-in-car-track-position__state {
            @include color('background-color', 'green', 1);
        }
    }

    // behind
    &[state="4"] {
        .c-in-car-track-position__state {
            @include color('background-color', 'green', 1);
        }
    }

    // leader (driver is backmarker)
    &[state="5"] {
        .c-in-car-track-position__state {
            @include color('background-color', 'red', 1);
        }
    }

    // backmarker
    &[state="6"] {
        .c-in-car-track-position__state {
            @include color('background-color', 'blue', 1);
        }
    }
}

.c-in-car-track-position__participant {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: em(16);
}

.c-in-car-track-position__position {}

.c-in-car-track-position__state {
    width: em(4);
    height: 100%;
}

.c-in-car-track-position__tag {
    @include color('background-color', 'white', 0.1);

    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: em(4);
    min-width: calc(5ch + em(4 * 2));
    min-height: em(20);

    span {
        @include color('background-color', 'white', 0.1);

        padding: em(2) em(4);
        width: 100%;
        text-align: center;
    }
}

.c-in-car-track-position__name {
    width: em(120);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.c-in-car-track-position__values {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: em(16);
}

.c-in-car-track-position__value {
    position: relative;
    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: center;
}

.c-in-car-track-position__time {
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
        // @include color('color', 'green', 1);
    }
}

.c-in-car-track-position__distance {
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
