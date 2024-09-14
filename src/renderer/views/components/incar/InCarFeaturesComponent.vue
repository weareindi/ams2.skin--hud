<template>
    <div class="c-in-car-data-features">
        <div class="c-in-car-data-items">
            <div class="c-in-car-data-item">
                <InCarDataDrsComponent />
            </div>
            <div class="c-in-car-data-item">
                <InCarDataErsComponent />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-in-car-data-features {

}

.c-in-car-data-items {
    display: flex;
    margin: em(-4);
}

.c-in-car-data-item {
    padding: em(4);
}
</style>

<script>
import InCarDataDrsComponent from './InCarDataDrsComponent.vue';
import InCarDataErsComponent from './InCarDataErsComponent.vue';

export default {
    components: {
        InCarDataDrsComponent,
        InCarDataErsComponent,
    }
}
</script>
