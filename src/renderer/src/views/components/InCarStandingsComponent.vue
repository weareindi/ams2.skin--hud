<template>
    <div class="c-in-car-standings">
        <div class="c-in-car-standings__items">
            <div class="c-in-car-standings__item" v-for="standing in standings">
                <InCarStandingComponent :standing="standing" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .c-in-car-standings {}

    .c-in-car-standings__items {
        display: flex;
        flex-direction: row;
        flex-wrap: none;
        width: 100vw;
        justify-content: center;
        align-items: flex-start;
        margin: em(-2);
    }

    .c-in-car-standings__item {
        padding: em(2);
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
        width: em(380);
    }
</style>

<script>
import { inject } from 'vue';
import InCarStandingComponent from '../components/InCarStandingComponent.vue';

export default {
    setup() {
        const standings = inject('standings');

        return {
            standings
        }
    },
    components: {
        InCarStandingComponent
    }
}
</script>
