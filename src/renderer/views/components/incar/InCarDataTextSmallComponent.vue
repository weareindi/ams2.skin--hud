<template>
    <div class="c-in-car-data-text-small">
        <span class="c-in-car-data-text-small__zerofill" v-if="data.zerofill">{{ data.zerofill }}</span>
        <span class="c-in-car-data-text-small__value" v-if="data.value ">{{ data.value }}</span>
        <span class="c-in-car-data-text-small__seperator" v-if="data.seperator">{{ data.seperator }}</span>
        <span class="c-in-car-data-text-small__suffix" v-if="data.suffix">{{ data.suffix }}</span>
    </div>
</template>

<style lang="scss">

.c-in-car-data-text-small {
    position: relative;
    display: flex;
}

.c-in-car-data-text-small__v {}

.c-in-car-data-text-small__zerofill,
.c-in-car-data-text-small__value,
.c-in-car-data-text-small__seperator,
.c-in-car-data-text-small__suffix {
    font-family: "uifont", sans-serif;
    font-size: em(10);
    // font-weight: bold;
    line-height: 1em;
    text-transform: uppercase;
    letter-spacing: 0;
}

.c-in-car-data-text-small__seperator,
.c-in-car-data-text-small__suffix {
    @include color('color', 'white', 0.2);
}

.c-in-car-data-text-small__k {
    text-align: center;
    padding: em(2) em(8);
}

.c-in-car-data-text-small__seperator {
    min-width: 0.4ch;
}

</style>

<script>

export default {
    props: {
        data: {},
    },
}
</script>
