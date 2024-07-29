<template>
    <div class="c-in-car-stat-values">
        <div class="c-in-car-stat-values__items">
            <div class="c-in-car-stat-values__item c-in-car-stat-values__item--a" v-if="a && a.value">
                <InCarStatValueComponent :monospace="a.monospace" :zerofill="a.zerofill" :value="a.value" :suffix="a.suffix" />
            </div>
            <div class="c-in-car-stat-values__item c-in-car-stat-values__item--b" v-if="b && b.value">
                <InCarStatValueComponent :monospace="b.monospace" :zerofill="b.zerofill" :value="b.value" :suffix="b.suffix" />
            </div>
        </div>
    </div>

</template>

<style lang="scss">
.c-in-car-stat-values {}

.c-in-car-stat-values__item--a {
    opacity: 0.75;
}

.c-in-car-stat-values__item--b {
    opacity: 0.5;
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


