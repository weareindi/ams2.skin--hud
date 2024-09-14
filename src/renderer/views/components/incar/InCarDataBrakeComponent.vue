<template>
    <div class="c-in-car-data-brake" :index="index">
        <div class="c-in-car-data-brake__temp" v-if="data[1]">
            <InCarDataTextSmallComponent :data="data[1]" />
        </div>
        <div class="c-in-car-data-brake__graphic" v-if="data[0]">
            <div class="c-in-car-data-brake__damage">
                <InCarDataDamageComponent :data="data[0]" icon="icon--brake" :index="index" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-data-brake {
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    width: em(38); // matching graphic/icon width
    overflow: visible;

    &[index="0"],
    &[index="2"] {
        // align-items: flex-end;
    }

    &[index="1"],
    &[index="3"] {
        // align-items: flex-start;
    }

    &[index="2"],
    &[index="3"] {
        flex-direction: column-reverse;
    }
}

.c-in-car-data-brake__temp {
    margin: em(12) 0;
}

.c-in-car-data-brake__graphic {
    display: flex;
    align-items: center;
    height: em(52); // to match tallest graphic in row
}

.c-in-car-data-brake__damage {
    width: em(38);
    height: em(38);
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
