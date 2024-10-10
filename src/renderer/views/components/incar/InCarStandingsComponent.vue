<template>
    <div class="c-in-car-standings">
        <div class="c-in-car-standings__items">
            <div class="c-in-car-standings__item" v-for="data in vTrackPositionCarousel">
                <div class="c-in-car-standings__participant" v-if="data[0]">
                    <span class="c-in-car-standings__position">{{ data[0].value }}</span>
                    <span class="c-in-car-standings__class">{{ data[0].suffix }}</span>
                    <span class="c-in-car-standings__name">{{ data[0].label }}</span>
                    <span class="c-in-car-standings__distance">{{ data[0].additional }}</span>
                    <span class="c-in-car-standings__distance-suffix">{{ data[0].additional_seperator }} {{ data[0].additional_suffix }}</span>
                </div>
                <div class="c-in-car-standings__state" v-if="data[1]" :state="data[1].state"></div>
                <div class="c-in-car-standings__timings">
                    <div class="c-in-car-standings__timing" v-if="data[2]">
                        <span class="c-in-car-standings__label">{{ data[2].label }}</span>
                        <span class="c-in-car-standings__time">{{ data[2].value }}</span>
                    </div>
                    <div class="c-in-car-standings__timing" v-if="data[3]">
                        <span class="c-in-car-standings__label">{{ data[3].label }}</span>
                        <span class="c-in-car-standings__time">{{ data[3].value }}</span>
                    </div>
                    <div class="c-in-car-standings__timing" v-if="data[4]">
                        <span class="c-in-car-standings__label">{{ data[4].label }}</span>
                        <span class="c-in-car-standings__time">{{ data[4].value }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-standings {
    display: flex;
    flex-wrap: none;
    justify-content: center;
    align-items: flex-start;
    width: 100vw;
}

.c-in-car-standings__items {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin: 0 1px;
}

.c-in-car-standings__item {
    padding: 0 1px;
}

.c-in-car-standings__participant {
    position: relative;
    width: em(385);
    height: em(40);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 em(10) 0 em(20);
    clip-path: polygon(em(10) 0, em(385 + 10) 0, em(385) 100%, 0 100%);

    &:before {
        @include color('background-color', 'black', 0.2);

        content: '';
        position: absolute;
        top: 0;
        right: em(-10);
        bottom: 0;
        left: 0;
        z-index: -1;
    }
}

.c-in-car-standings__position,
.c-in-car-standings__class,
.c-in-car-standings__distance,
.c-in-car-standings__distance-suffix {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-standings__position {
    font-size: em(16);
    line-height: 1em;
}

.c-in-car-standings__class {
    @include color('background-color', 'primary', 1);
    @include color('color', 'secondary', 1);

    font-size: em(14);
    line-height: 1em;

    margin: 0 0 0 em(12, 14);
    padding: em(6, 14) em(10, 14);
    border-radius: em(4, 14);
}

.c-in-car-standings__name {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    font-size: em(16);
    line-height: 1em;
    text-transform: uppercase;

    margin: 0 0 0 em(12, 16);
}

.c-in-car-standings__distance {
    font-size: em(16);
    line-height: 1em;

    margin: 0 0 0 em(12, 16);
}

.c-in-car-standings__distance-suffix {
    font-size: em(16);
    line-height: 1em;
}

.c-in-car-standings__state {
    height: em(4);

    // driver
    &[state="0"] {
        // @include color('background-color', 'white', 1);
    }

    // out lap
    &[state="1"] {
        @include color('background-color', 'blue', 1);
    }

    // hot lap
    &[state="2"] {
        @include color('background-color', 'red', 1);
    }

    // ahead
    &[state="3"] {
        @include color('background-color', 'green', 1);
    }

    // behind
    &[state="4"] {
        @include color('background-color', 'green', 1);
    }

    // leader (driver is backmarker)
    &[state="5"] {
        @include color('background-color', 'red', 1);
    }

    // backmarker
    &[state="6"] {
        @include color('background-color', 'blue', 1);
    }
}

.c-in-car-standings__timings {
    margin: 2px 0 0;
}

.c-in-car-standings__timing {
    @include color('background-color', 'black', 0.2);

    display: flex;
    justify-content: space-between;
    padding: em(4) em(10);

    + .c-in-car-standings__timing {
        margin: 1px 0 0;
    }
}

.c-in-car-standings__label,
.c-in-car-standings__time {
    font-size: em(14);
    line-height: 1em;
    text-transform: uppercase;
}

.c-in-car-standings__label {}

.c-in-car-standings__time {}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const vTrackPositionCarousel = inject('vTrackPositionCarousel');

        return {
            vTrackPositionCarousel
        }
    }
}
</script>
