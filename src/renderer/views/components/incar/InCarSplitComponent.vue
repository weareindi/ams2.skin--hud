<template>
    <div class="c-in-car-split" :inverted="inverted" v-for="item in data" :state="`${item.state !== null ? item.state : 0}`">
        <div class="c-in-car-split__frame">
            <div class="c-in-car-split__v" v-if="item.value">
                <div class="c-in-car-split__value" v-html="item.value"></div>
                <div class="c-in-car-split__seperator" v-html="item.seperator"></div>
                <div class="c-in-car-split__suffix" v-html="item.suffix"></div>
            </div>
            <div class="c-in-car-split__k" v-if="item.label">
                <div class="c-in-car-split__label" v-html="item.label"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-split {
    position: relative;
    padding-top: em(5);
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    border-bottom-left-radius: em(8);
    border-bottom-right-radius: em(8);

    &[inverted="true"] {
        flex-direction: row-reverse;
    }

    &[state] {
        &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            height: em(5);
        }
    }

    &[state="5"] {
        &:before {
            @include color('background-color', 'red');
        }

        .c-in-car-split__frame {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }

    &[state="1"] {
        &:before {
            @include color('background-color', 'green');
        }

        .c-in-car-split__frame {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }

    &[state="2"] {
        @include color('background-color', 'green');

        &:before {
            @include color('background-color', 'green');

            animation-name: flash;
            animation-duration: 600ms;
            animation-timing-function: linear;
            animation-direction: alternate;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;
        }

        .c-in-car-split__frame {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    }
}

.c-in-car-split__frame {
    position: relative;
    overflow: hidden;
    border-radius: em(8);
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
}

.c-in-car-split__v,
.c-in-car-split__k {
    display: flex;
    flex-wrap: nowrap;

    padding: em(6) em(8);
}

.c-in-car-split__v {
    @include color('background-color', 'black', 0.5);
}

.c-in-car-split__k {
    @include color('background-color', 'black', 0.2);
}

.c-in-car-split__value,
.c-in-car-split__suffix,
.c-in-car-split__seperator {
    font-family: 'uifont-mono', monospace;
    font-size: em(10);
    line-height: 1em;
    white-space: pre;
}

.c-in-car-split__label {
    font-family: 'uifont', sans-serif;
    font-size: em(10);
    line-height: 1em;
}
</style>


<script>
export default {
    props: {
        inverted: false,
        data: null
    },
}
</script>