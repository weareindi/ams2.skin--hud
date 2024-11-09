<template>
    <div class="c-in-car-steering" :state="data.state">
        <span class="c-in-car-steering__total"></span>
        <span class="c-in-car-steering__amount c-in-car-steering__amount--left" :style="`transform: scaleX(${negative})`"></span>
        <span class="c-in-car-steering__amount c-in-car-steering__amount--right" :style="`transform: scaleX(${positive})`"></span>
    </div>
</template>

<style lang="scss">

.c-in-car-steering {
    position: relative;
    width: 100%;
    height: em(6);
    filter: drop-shadow(0px 0px 0px white);

    &[state="6"] {
        .c-in-car-steering__total,
        .c-in-car-steering__amount {
            animation-name: flash;
            animation-duration: 150ms;
            animation-timing-function: linear;
            animation-direction: alternate;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;
        }

        .c-in-car-steering__total {
            @include color('background-color', 'red', 0.4);
        }

        .c-in-car-steering__amount {
            @include color('background-color', 'red', 1);
        }
    }
}

.c-in-car-steering__total {
    @include color('background-color', 'white', 0.1);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.c-in-car-steering__amount {
    @include color('background-color', 'white', 1);

    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    transform-origin: 50% 100%;
    transition: 50ms transform 0ms linear;
    will-change: transform;
}

.c-in-car-steering__amount--left {
    left: 0%;
    transform-origin: 100% 0;
    transform: scaleX(0.5);
}

.c-in-car-steering__amount--right {
    right: 0%;
    transform-origin: 0 0;
    transform: scaleX(0.5);
}


</style>

<script>

export default {
    props: {
        data: {},
    },
    computed: {
        negative() {
            if (this.data.value > 0) {
                return 0;
            }

            return Math.abs(this.data.value);
        },
        positive() {
            if (this.data.value < 0) {
                return 0;
            }

            return this.data.value;
        }
    }
}
</script>
