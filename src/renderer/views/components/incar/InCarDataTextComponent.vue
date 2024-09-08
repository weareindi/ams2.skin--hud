<template>
    <div class="c-in-car-data-text">
        <span class="c-in-car-data-text__v">
            <span class="c-in-car-data-text__zerofill">{{ data.zerofill }}</span>
            <span class="c-in-car-data-text__value">{{ data.value }}</span>
            <span class="c-in-car-data-text__seperator">{{ data.seperator }}</span>
            <span class="c-in-car-data-text__suffix">{{ data.suffix }}</span>
        </span>
        <span class="c-in-car-data-text__k">
            <span class="c-in-car-data-text__label">{{ data.label }}</span>
            <span class="c-in-car-data-text__additional">{{ data.additional }}</span>
        </span>
    </div>
</template>

<style lang="scss">

.c-in-car-data-text {
    position: relative;
    display: flex;
}

.c-in-car-data-text__v {
    @include color('background-color', 'white', 0.2);

    min-width: em(78);
    text-align: center;
    padding: em(2) em(8);
    border-radius: em(2);
}

.c-in-car-data-text__zerofill,
.c-in-car-data-text__value,
.c-in-car-data-text__seperator,
.c-in-car-data-text__suffix {
    font-family: "uifont-mono", monospace;
}

.c-in-car-data-text__label,
.c-in-car-data-text__additional {
    font-family: "uifont", monospace;
}

.c-in-car-data-text__zerofill,
.c-in-car-data-text__value,
.c-in-car-data-text__seperator,
.c-in-car-data-text__suffix,
.c-in-car-data-text__label,
.c-in-car-data-text__additional {
    display: inline-block;
    vertical-align: middle;
    font-weight: regular;
    font-size: em(10);
    line-height: 1em;
    text-transform: uppercase;
    letter-spacing: 0;
}


.c-in-car-data-text__seperator,
.c-in-car-data-text__suffix {
    @include color('color', 'white', 0.8);
}

.c-in-car-data-text__k {
    text-align: center;
    padding: em(2) em(8);
}
</style>

<script>

export default {
    props: {
        data: {},
    },
}
</script>
