<template>
    <div class="c-in-car-level" :state="data.state">
        <span class="c-in-car-level__total"></span>
        <span class="c-in-car-level__max" :style="`bottom: ${data.additional * 100}%`"></span>
        <span class="c-in-car-level__amount" :style="`transform: scaleY(${data.value})`"></span>
    </div>
</template>

<style lang="scss">

.c-in-car-level {
    position: relative;
    width: em(6);
    height: em(107);
    overflow: hidden;
    filter: drop-shadow(0px 0px 0px white);
    transition: 150ms filter 0ms linear;
    will-change: auto;

    &[state="1"] {
        filter: drop-shadow(0px 0px 2px white);

        animation-name: pulse;
        animation-duration: 150ms;
        animation-timing-function: linear;
        animation-direction: alternate;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
    }
}

.c-in-car-level__total {
    @include color('background-color', 'white', 0.1);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.c-in-car-level__amount {
    @include color('background-color', 'white', 1);

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scaleY(0);
    transform-origin: 50% 100%;
    transition: 50ms transform 0ms linear;
    will-change: auto;
}

.c-in-car-level__max {
    @include color('background-color', 'white', 1);

    position: absolute;
    bottom: 0%;
    right: 0;
    left: 0;
    height: 2px;
    margin-bottom: -2px;
    transform-origin: 50% 100%;
    transition: 150ms bottom 0ms linear;
    will-change: auto;
}

</style>

<script>

export default {
    props: {
        data: {},
    },
}
</script>
