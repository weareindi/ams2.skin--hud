<template>
    <div class="c-standings-page">
        <div class="c-standings-page__cols">
            <div class="c-standings-page__col">
                <div class="c-standings-page__items">
                    <div class="c-standings-page__item" v-for="(n, index) in 3">
                        <StandingsItemComponent v-if="participants[index]" :data="participants[index]" :mCarClassColor="mCarClassColor" />
                    </div>
                </div>
            </div>
            <div class="c-standings-page__col">
                <div class="c-standings-page__items">
                    <div class="c-standings-page__item" v-for="(n, index) in 3">
                        <StandingsItemComponent v-if="participants[index+3]" :data="participants[index+3]" :mCarClassColor="mCarClassColor" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-standings-page {
    width: em(1280 + 64);
    margin: 0 auto;
    padding: em(32);
}

.c-standings-page__cols {
    display: flex;
    flex-direction: rows;
    width: 100%;
}

.c-standings-page__col {
    width: 50%;
}

.c-standings-page__items {
    margin: em(-8);
}

.c-standings-page__item {
    padding: em(8);
    min-height: em(64 + (8 * 2));
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
