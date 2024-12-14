<template>
    <div class="c-in-car-data-text-small" :state="data.state">
        <span class="c-in-car-data-text-small__zerofill" v-if="data.zerofill" v-html="data.zerofill"></span>
        <span class="c-in-car-data-text-small__value" v-if="data.value" v-html="data.value"></span>
        <span class="c-in-car-data-text-small__seperator" v-if="data.seperator" v-html="data.seperator"></span>
        <span class="c-in-car-data-text-small__suffix" v-if="data.suffix" v-html="data.suffix"></span>
    </div>
</template>

<style lang="scss">

.c-in-car-data-text-small {
    position: relative;
    display: flex;

    &:before {
        content: '';
        position: absolute;
        z-index: 1;
        top: em(-4);
        right: em(-4);
        bottom: em(-4);
        left: em(-4);
        border-radius: em(2);

    }

    &[state="0"] {
    }

    &[state="1"] {
        &:before {
            @include color('background-color', 'blue', 1);
        }
    }

    &[state="2"] {}

    &[state="3"] {}

    &[state="4"] {
        &:before {
            @include color('background-color', 'yellow', 1);
        }

        .c-in-car-data-text-small__zerofill,
        .c-in-car-data-text-small__value,
        .c-in-car-data-text-small__seperator,
        .c-in-car-data-text-small__suffix {
            @include color('color', 'black', 1);
        }
    }

    &[state="5"] {
        &:before {
            @include color('background-color', 'red', 1);
        }
    }

    &[state="6"] {
        &:before {
            @include color('background-color', 'red', 1);

            animation-name: flash;
            animation-duration: 150ms;
            animation-timing-function: linear;
            animation-direction: alternate;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;
        }
    }
}

.c-in-car-data-text-small__zerofill,
.c-in-car-data-text-small__value,
.c-in-car-data-text-small__seperator,
.c-in-car-data-text-small__suffix {
    position: relative;
    z-index: 2;
    font-size: em(14);
    line-height: 1em;
    text-transform: uppercase;
}

.c-in-car-data-text-small__seperator,
.c-in-car-data-text-small__suffix {
    @include color('color', 'white', 0.2);
}

.c-in-car-data-text-small__seperator {
    min-width: 0.2ch;
}

</style>

<script>
export default {
    props: {
        data: {},
    },
}
</script>
