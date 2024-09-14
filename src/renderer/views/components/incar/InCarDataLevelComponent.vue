<template>
    <div class="c-in-car-level">
        <span class="c-in-car-level__total"></span>
        <span class="c-in-car-level__amount" :style="`transform: scaleY(${data.value})`"></span>
    </div>
</template>

<style lang="scss">

.c-in-car-level {
    position: relative;
    width: em(6);
    height: em(107);
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
    will-change: transform;
}

</style>

<script>

export default {
    props: {
        data: {},
    },
}
</script>
