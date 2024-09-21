<template>
    <div class="c-in-car-data-text" :state="data.state">
        <span class="c-in-car-data-text__v">
            <span class="c-in-car-data-text__zerofill" v-html="data.zerofill"></span>
            <span class="c-in-car-data-text__value" v-html="data.value"></span>
            <span class="c-in-car-data-text__seperator" v-html="data.seperator"></span>
            <span class="c-in-car-data-text__suffix" v-html="data.suffix"></span>
        </span>
        <span class="c-in-car-data-text__k">
            <span class="c-in-car-data-text__label" v-html="data.label"></span>
            <span class="c-in-car-data-text__additional" v-html="data.additional"></span>
        </span>
    </div>
</template>

<style lang="scss">

.c-in-car-data-text {
    position: relative;
    display: flex;

    &[state="6"] {
        .c-in-car-data-text__v {
            &:before {
                @include color('background-color', 'red', 1);

                content: '';
                position: absolute;
                z-index: 1;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;

                animation-name: flash;
                animation-duration: 150ms;
                animation-timing-function: linear;
                animation-direction: alternate;
                animation-fill-mode: forwards;
                animation-iteration-count: infinite;
            }
        }
    }
}

.c-in-car-data-text__v {
    @include color('background-color', 'white', 0.2);

    position: relative;
    min-width: em(86);
    text-align: center;
    padding: em(2) em(8);
    border-radius: em(2);
    overflow: hidden;
}

.c-in-car-data-text__zerofill,
.c-in-car-data-text__value,
.c-in-car-data-text__seperator,
.c-in-car-data-text__suffix {
    position: relative;
    z-index: 2;
    font-family: "uifont-mono", monospace;
}

.c-in-car-data-text__label,
.c-in-car-data-text__additional {
    font-family: "uifont", sans-serif;
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
