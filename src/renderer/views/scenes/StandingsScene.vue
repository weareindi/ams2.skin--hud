<template>
    <div class="s-standings">
        <div class="s-standings__header">
            <StandingsHeaderComponent :mCarClassName="vData.vStandings.mCarClassName" :mCarClassColor="vData.vStandings.mCarClassColor" />
        </div>
        <div class="s-standings__body">
            <StandingsPageComponent :mCarClassColor="vData.vStandings.mCarClassColor" :participants="vData.vStandings.participants" />
        </div>
    </div>
</template>

<style lang="scss">
.s-standings {
    @include color('background-color', 'black', 0.8);

    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.s-standings__header,
.s-standings__body {
    width: 100%;
}

.s-standings__header {}

.s-standings__body {
    margin: em(32) 0 0;
}
</style>

<script>
import { inject } from 'vue';
import StandingsHeaderComponent from '../components/standings/StandingsHeaderComponent.vue';
import StandingsPageComponent from '../components/standings/StandingsPageComponent.vue';

export default {
    setup() {
        const vData = inject('vData');

        return {
            vData,
        }
    },
    components: {
        StandingsHeaderComponent,
        StandingsPageComponent,
    }
}
</script>
