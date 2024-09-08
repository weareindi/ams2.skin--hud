<template>
    <div class="c-in-car-data-drs" v-for="item in vDRS">
        <span class="c-in-car-data-drs__state" :state="item.state"></span>
        <span class="c-in-car-data-drs__label">{{ item.label }}</span>
    </div>
</template>

<style lang="scss">
.c-in-car-data-drs {
    position: relative;
    width: em(148);
    height: em(64);

    display: flex;
    align-items: center;
    justify-content: center;

    clip-path: polygon(
        em(10) em(0),
        em(148) em(0),
        em(148 - 10) em(64),
        em(0) em(64),
    );
}

.c-in-car-data-drs__state {
    @include color('background-color', 'white', 0.2);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    // &[state="0"] {
    //     @include color('background-color', 'yellow');
    // }

    &[state="1"] {
        // @include color('background-color', 'yellow');
    }

    &[state="2"] {
        // @include color('background-color', 'yellow');

        // ~ .c-in-car-data-drs__label {
        //     @include color('color', 'black');
        // }
    }

    &[state="3"] {
        @include color('background-color', 'yellow');

        animation-name: flash;
        animation-duration: 150ms;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;

        ~ .c-in-car-data-drs__label {
            @include color('color', 'black');
        }
    }

    &[state="4"] {
        @include color('background-color', 'yellow');

        ~ .c-in-car-data-drs__label {
            @include color('color', 'black');
        }
    }
}

.c-in-car-data-drs__label {
    @include color('color', 'white');

    position: relative;
    font-family: "uifont", sans-serif;
    font-size: em(12);
    line-height: 1em;
    text-transform: uppercase;
    letter-spacing: 0;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const vDRS = inject('vDRS');

        return {
            vDRS
        }
    }
}
</script>
