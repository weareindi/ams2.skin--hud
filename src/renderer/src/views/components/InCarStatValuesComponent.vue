<template>
    <div class="c-in-car-stat-values">
        <div class="c-in-car-stat-values__items">
            <div class="c-in-car-stat-values__item c-in-car-stat-values__item--a" v-if="a && a.value" :state="a.state">
                <span class="c-in-car-stat-values__value"><InCarStatValueComponent :monospace="a.monospace" :zerofill="a.zerofill" :value="a.value" :suffix="a.suffix" /></span>
                <span class="c-in-car-stat-values__state" v-if="a.state" :style="`opacity: ${a.stateAmount};`"></span>
            </div>
            <div class="c-in-car-stat-values__item c-in-car-stat-values__item--b" v-if="b && b.value" :state="b.state">
                <span class="c-in-car-stat-values__value"><InCarStatValueComponent :monospace="b.monospace" :zerofill="b.zerofill" :value="b.value" :suffix="b.suffix" /></span>
                <span class="c-in-car-stat-values__state" v-if="b.state" :style="`opacity: ${b.stateAmount};`"></span>
            </div>
        </div>
    </div>

</template>

<style lang="scss">
.c-in-car-stat-values {}

.c-in-car-stat-values__item {
    position: relative;
    overflow: hidden;
    border-radius: em(4);

    &[state="blue"] {
        .c-in-car-stat-values__state {
            @include color('background-color', 'blue');
        }
    }

    &[state="red"] {
        .c-in-car-stat-values__state {
            @include color('background-color', 'red');
        }
    }

    &[state="yellow"] {
        .c-in-car-stat-values__state {
            @include color('background-color', 'yellow');
        }
    }

    &[state="green"] {
        .c-in-car-stat-values__state {
            @include color('background-color', 'green');
        }
    }
}

.c-in-car-stat-values__state {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    mix-blend-mode: multiply;
}


.c-in-car-stat-values__item--a {
    .c-in-car-stat-values__value {
        opacity: 0.75;
    }
}

.c-in-car-stat-values__item--b {
    .c-in-car-stat-values__value {
        opacity: 0.5;
    }
}
</style>

<script>
import InCarStatValueComponent from '../components/InCarStatValueComponent.vue';

export default {
    props: {
        a: {},
        b: {},
    },
    components: {
        InCarStatValueComponent
    }
}
</script>


