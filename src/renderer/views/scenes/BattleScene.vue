<template>
    <div class="s-battle" v-if="vData.vBattle" :total="`${vData.vBattle.length}`">
        <div class="s-battle__cells">
            <div class="s-battle__cell" v-if="vData.vBattle[0]">
                <div class="s-battle__participant">
                    <BattleParticipant :data="vData.vBattle[0]" :large="`${vData.vBattle.length <= 2 ? true : false}`" />
                </div>
            </div>
            <div class="s-battle__cell s-battle__cell--distance" v-if="vData.vBattle[1] && vData.vBattle[1].vDistance">
                <div class="s-battle__distance">
                    <BattleDistance :data="vData.vBattle[1].vDistance" />
                </div>
            </div>
            <div class="s-battle__cell" v-if="vData.vBattle[1]">
                <div class="s-battle__participant">
                    <BattleParticipant :data="vData.vBattle[1]" :large="`${vData.vBattle.length <= 2 ? true : false}`" :invert="`${vData.vBattle.length === 2 ? true : false}`" />
                </div>
            </div>
            <div class="s-battle__cell s-battle__cell--distance" v-if="vData.vBattle[2] && vData.vBattle[2].vDistance">
                <div class="s-battle__distance">
                    <BattleDistance :data="vData.vBattle[2].vDistance" />
                </div>
            </div>
            <div class="s-battle__cell" v-if="vData.vBattle[2]">
                <div class="s-battle__participant">
                    <BattleParticipant :data="vData.vBattle[2]" :large="`${vData.vBattle.length <= 2 ? true : false}`" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.s-battle {
    @include color('background-color', 'pitbox', 0.8);

    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: em(16) em(32);

    &[total="2"] {
        .s-battle__cells {
            width: em(1280);
        }
    }
}

.s-battle__cells {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    margin: 0 auto;
    width: em(1680);
}

.s-battle__cell {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

.s-battle__cell--distance {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    justify-content: center;
    align-items: center;
}

.s-battle__distance {
    display: flex;
}

.s-battle__participant {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
}

</style>

<script>
import { inject } from 'vue';
import BattleParticipant from '../components/battle/BattleParticipant.vue';
import BattleDistance from '../components/battle/BattleDistance.vue';

export default {
    setup() {
        const vData = inject('vData');

        return {
            vData
        }
    },
    components: {
        BattleParticipant,
        BattleDistance,
    }
}
</script>
