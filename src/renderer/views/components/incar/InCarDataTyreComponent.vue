<template>
    <div class="c-in-car-data-tyre" :index="index">
        <div class="c-in-car-data-tyre__pressure" v-if="data[3]">
            <InCarDataTextSmallComponent :data="data[3]" />
        </div>
        <div class="c-in-car-data-tyre__temp" v-if="data[2]">
            <InCarDataTextSmallComponent :data="data[2]" />
        </div>
        <div class="c-in-car-data-tyre__graphic" v-if="data[0]">
            <div class="c-in-car-data-tyre__damage">
                <InCarDataDamageComponent :data="data[0]" icon="icon--tyre" :index="index" />
            </div>
            <div class="c-in-car-data-tyre__compound" v-if="data[1]">{{ data[1].value }}</div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-data-tyre {
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    width: em(24); // matching graphic/icon width
    overflow: visible;

    &[index="0"],
    &[index="2"] {
        align-items: flex-end;
    }

    &[index="1"],
    &[index="3"] {
        align-items: flex-start;
    }

    &[index="2"],
    &[index="3"] {
        flex-direction: column-reverse;
    }
}

.c-in-car-data-tyre__temp {
    margin: em(12) 0;
}

.c-in-car-data-tyre__graphic {
    position: relative;
    display: flex;
    align-items: center;
    height: em(52); // to match tallest graphic in row
}

.c-in-car-data-tyre__damage {
    width: em(24);
    height: em(52);
}

.c-in-car-data-tyre__compound {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    vertical-align: middle;

    font-family: "uifont-mono", monospace;
    font-size: em(9);
    font-weight: bold;
    line-height: 1em;
    text-transform: uppercase;
}
</style>

<script>
import SvgComponent from '../SvgComponent.vue';
import InCarDataTextSmallComponent from './InCarDataTextSmallComponent.vue';
import InCarDataDamageComponent from './InCarDataDamageComponent.vue';

export default {
    setup() {},
    props: {
        index: null,
        data: {},
    },
    components: {
        SvgComponent,
        InCarDataTextSmallComponent,
        InCarDataDamageComponent,
    }
}
</script>
