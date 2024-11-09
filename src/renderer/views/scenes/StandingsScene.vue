<template>
    <div class="s-standings">
        <div class="s-standings__header" v-if="vData.vStandings.vCarClassName">
            <StandingsHeaderComponent :vCarClassName="vData.vStandings.vCarClassName" />
        </div>
        <div class="s-standings__body">
            <StandingsPageComponent :participants="vData.vStandings.participants" />
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
    padding: em(32);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.s-standings__header,
.s-standings__body {
    width: em(1280);
    margin: 0 auto;
}

.s-standings__header {
    ~ .s-standings__body {
        margin: em(32) 0 0;
    }
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
