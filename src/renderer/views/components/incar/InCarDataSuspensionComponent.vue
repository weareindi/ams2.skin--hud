<template>
    <div class="c-in-car-data-suspension" :index="index">
        <div class="c-in-car-data-suspension__graphic" v-if="data[0]">
            <div class="c-in-car-data-suspension__damage">
                <InCarDataDamageComponent :data="data[0]" icon="icon--suspension" :index="index" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-data-suspension {
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    width: em(14); // matching graphic/icon width
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

.c-in-car-data-suspension__graphic {
    display: flex;
    align-items: center;
    height: em(52); // to match tallest graphic in row
}

.c-in-car-data-suspension__damage {
    width: em(14);
    height: em(52);
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
