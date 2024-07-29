<template>
    <div class="c-in-car-stat" :state="state">
        <div class="c-in-car-stat__items">
            <div class="c-in-car-stat__item" v-if="left && left.a">
                <InCarStatValuesComponent :a="left.a.a" :b="left.a.b" />
            </div>
            <div class="c-in-car-stat__item c-in-car-stat__item--icon" v-if="icon">
                <div class="c-in-car-stat__icon"><SvgComponent :svg="`icon--${icon}`" /></div>
            </div>
            <div class="c-in-car-stat__item" v-if="right && right.a">
                <InCarStatValuesComponent :a="right.a.a" :b="right.a.b" />
            </div>
            <div class="c-in-car-stat__item" v-if="right && right.b">
                <InCarStatValuesComponent :a="right.b.a" :b="right.b.b" />
            </div>
            <div class="c-in-car-stat__item" v-if="right && right.c">
                <InCarStatValuesComponent :a="right.c.a" :b="right.c.b" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-stat {
    position: relative;
    display: flex;
    padding: em(4) em(10);
    border-radius: em(3);

    &:after {
        // @include color('background-color', 'yellow');

        content: '';
        position: absolute;
        z-index: 10;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: em(3);
        mix-blend-mode: multiply;
    }

    &[state="blue"] {
        &:after {
            @include color('background-color', 'blue');
        }
    }

    &[state="green"] {
        &:after {
            @include color('background-color', 'green');
        }
    }

    &[state="red"] {
        &:after {
            @include color('background-color', 'red');
        }
    }

    &[state="yellow"] {
        &:after {
            @include color('background-color', 'yellow');
        }
    }
}

.c-in-car-stat__items {
    display: flex;
    align-items: center;
}

.c-in-car-stat__item {
    display: flex;

    + .c-in-car-stat__item--icon {
        margin-left: em(12);
    }

    + .c-in-car-stat__item {
        margin-left: em(4);
    }
}

.c-in-car-stat__item--icon {
    + .c-in-car-stat__item {
        margin-left: em(12);
    }
}

.c-in-car-stat__icon {
    display: block;
    width: em(22);
    height: em(22);
}
</style>

<script>
import InCarStatValuesComponent from '../components/InCarStatValuesComponent.vue';

export default {
    props: {
        icon: {},
        left: {},
        right: {},
        state: {}
    },
    components: {
        InCarStatValuesComponent
    },
}
</script>

