<template>
    <div class="c-in-car-icon">
        <span class="c-in-car-icon__state" :state></span>
        <span class="c-in-car-icon__svg">
            <SvgComponent :svg="svg" />
        </span>
    </div>
</template>

<style lang="scss">

.c-in-car-icon {
    position: relative;
    width: em(32);
    height: em(32);
    border-radius: em(32 * 0.5);
    overflow: hidden;
}

.c-in-car-icon__state {
    @include color('background-color', 'white', 0.1);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: 150ms background-color 0ms ease;

    &[state="0"] {
        // same as default
    }

    &[state="1"] {
        @include color('background-color', 'green', 1);
    }

    &[state="2"] {
        @include color('background-color', 'green', 1);

        animation-name: flash;
        animation-duration: 150ms;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
    }

    &[state="3"] {
        @include color('background-color', 'yellow', 1);

        ~ .c-in-car-icon__svg {
            svg {
                path {
                    @include color('fill', 'black');
                }
            }
        }
    }

    &[state="4"] {
        @include color('background-color', 'yellow', 1);

        animation-name: flash;
        animation-duration: 150ms;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;

        ~ .c-in-car-icon__svg {
            svg {
                path {
                    @include color('fill', 'black');
                }
            }
        }
    }

    &[state="5"] {
        @include color('background-color', 'red', 1);
    }

    &[state="6"] {
        @include color('background-color', 'red', 1);

        animation-name: flash;
        animation-duration: 150ms;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
    }

    &[state="7"] {
        @include color('background-color', 'blue', 1);
    }

    &[state="8"] {
        @include color('background-color', 'blue', 1);

        animation-name: flash;
        animation-duration: 150ms;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
    }
}

.c-in-car-icon__svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: em(8);
}

</style>

<script>
import SvgComponent from '../SvgComponent.vue';

export default {
    props: {
        state: {
            default: 0
        },
        svg: {
            default: null
        }
    },
    components: {
        SvgComponent
    }
}
</script>
