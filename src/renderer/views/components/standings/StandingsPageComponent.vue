<template>
    <div class="c-standings-page">
        <div class="c-standings-page__cols">
            <div class="c-standings-page__col">
                <div class="c-standings-page__items">
                    <div class="c-standings-page__item" v-for="(n, index) in 3">
                        <StandingsItemComponent v-if="participants[index]" :data="participants[index]" />
                    </div>
                </div>
            </div>
            <div class="c-standings-page__col">
                <div class="c-standings-page__items">
                    <div class="c-standings-page__item" v-for="(n, index) in 3">
                        <StandingsItemComponent v-if="participants[index+3]" :data="participants[index+3]" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-standings-page {}

.c-standings-page__cols {
    display: flex;
    flex-direction: rows;
    margin: 0 em(-32);
    width: 100%;
}

.c-standings-page__col {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    padding: 0 em(32);
    width: 50%;
    overflow: hidden;
}

.c-standings-page__items {}

.c-standings-page__item {
    ~ .c-standings-page__item {
        margin: em(20) 0 0;
    }
}
</style>

<script>
import StandingsItemComponent from './StandingsItemComponent.vue';

export default {
    props: {
        mCarClassColor: null,
        participants: null,
    },
    components: {
        StandingsItemComponent
    }
}
</script>
