<template>
    <div class="c-in-car-data-icon-value">
        <span class="c-in-car-data-icon-value__i">
            <InCarIconComponent :svg="icon" :state="data.state"/>
        </span>
        <span class="c-in-car-data-icon-value__v">
            <span class="c-in-car-data-icon-value__zerofill" v-html="data.zerofill"></span>
            <span class="c-in-car-data-icon-value__value" v-html="data.value"></span>
            <span class="c-in-car-data-icon-value__seperator" v-html="data.seperator"></span>
            <span class="c-in-car-data-icon-value__suffix" v-html="data.suffix"></span>
        </span>
    </div>
</template>

<style lang="scss">

.c-in-car-data-icon-value {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.c-in-car-data-icon-value__i {}

.c-in-car-data-icon-value__v {
    margin: 0 0 0 em(8);
}

.c-in-car-data-icon-value__zerofill,
.c-in-car-data-icon-value__value,
.c-in-car-data-icon-value__seperator,
.c-in-car-data-icon-value__suffix {
    font-size: em(14);
    line-height: 1em;
}

.c-in-car-data-icon-value__zerofill {
    @include color('color', 'white', 0.2);
}

.c-in-car-data-icon-value__seperator,
.c-in-car-data-icon-value__suffix {
    @include color('color', 'white', 0.8);
}

</style>

<script>
import InCarIconComponent from './InCarIconComponent.vue';

export default {
    props: {
        data: {},
        icon: {},
    },
    components: {
        InCarIconComponent
    }
}
</script>
