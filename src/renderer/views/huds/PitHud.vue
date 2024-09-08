<template>
    <div class="c-hud-pit">
        <div class="c-hud-pit__fuel-calc"><PitFuelCalcComponent /></div>
    </div>
</template>

<style lang="scss">
.c-hud-pit {}

.c-hud-pit__fuel-calc {
    position: fixed;
    bottom: (math.div(161, 1080) * 100%);
    right: (math.div(78, 1920) * 100%);
}
</style>

<script>
import PitFuelCalcComponent from '../components/pit/PitFuelCalcComponent.vue';

export default {
    components: {
        PitFuelCalcComponent
    }
}
</script>