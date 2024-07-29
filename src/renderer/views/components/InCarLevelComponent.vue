<template>
    <div class="c-in-car-level" :align="align" :status="status">
        <div class="c-in-car-level__columns">
            <div class="c-in-car-level__column c-in-car-level__column--meter">
                <div class="c-in-car-level__placeholder"></div>
                <div class="c-in-car-level__value" :style="`transform: scaleY(${100 - value}%);`"></div>
            </div>
            <div class="c-in-car-level__column c-in-car-level__column--position">
                <div class="c-in-car-level__placeholder"></div>
                <div class="c-in-car-level__value" :style="`top: ${value}%;`"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-level {
    display: flex;
    flex-direction: row;
    height: 100%;

    &[align="right"] {
        .c-in-car-level__column--meter {
            margin: 0 0 0 em(2);
            order: 2;
        }

        .c-in-car-level__column--position {
            order: 1;
        }
    }

    &[status="new"] {
        .c-in-car-level__column--position {
            .c-in-car-level__value:after {
                box-shadow: 0px 0px 4px 0px #FFF;
            }
        }
    }

    // &[status="light"] {}

    // &[status="medium"] {}

    // &[status="heavy"] {}

    // &[status="destroyed"] {}
}

.c-in-car-level__columns {
    display: flex;
    flex-direction: row;
}

.c-in-car-level__column {
    position: relative;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
}

.c-in-car-level__column--meter {
    width: em(2);
    margin: 0 em(2) 0 0;

    .c-in-car-level__placeholder {
        @include color('background-color', 'white', 0.3);

        position: absolute;
        top: 0;
        left: 0;
        width: em(2);
        height: 100%;
        border-radius: em(1);
    }

    .c-in-car-level__value {
        @include color('background-color', 'white', 1);

        position: absolute;
        bottom: 0;
        left: 0;
        width: em(2);
        height: 100%;
        border-radius: em(1);
        transform-origin: 50% 100%;
    }
}

.c-in-car-level__column--position {
    width: em(4);
    margin-top: em(2);
    margin-bottom: em(2);

    .c-in-car-level__placeholder {
        @include color('background-color', 'white', 0.3);

        position: absolute;
        top: 50%;
        left: 50%;
        width: em(4);
        height: em(4);
        border-radius: em(2);
        margin-top: em(-2);
        margin-left: em(-2);
    }

    .c-in-car-level__value {
        position: absolute;
        top: 0;
        left: 0;
        width: em(4);
        height: 0;

        &:after {
            @include color('background-color', 'white', 1);

            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: em(4);
            height: em(4);
            border-radius: em(2);
            margin-top: em(-2);
            margin-left: em(-2);
        }
    }
}
</style>

<script>


export default {
    props: {
        align: null,
        value: null,
        status: null,
    }
}
</script>

