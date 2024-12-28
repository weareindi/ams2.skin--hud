<template>
    <div class="c-hud-pit">
        <div class="c-hud-pit__air-pressure"><PitAirPressureComponent /></div>
        <div class="c-hud-pit__fuel-calc"><PitFuelCalcComponent /></div>
    </div>
</template>

<style lang="scss">
.c-hud-pit {
    position: relative;
    // font-family: "secularone";
    width: em(1920);
    height: em(1920);
    margin: auto;
}

.c-hud-pit__air-pressure {
    position: absolute;
    top: em(25);
    right: em(242);
}

.c-hud-pit__fuel-calc {
    position: absolute;
    top: em(95);
    right: em(390);
}
</style>

<script>
import PitAirPressureComponent from '../components/pit/PitAirPressureComponent.vue';
import PitFuelCalcComponent from '../components/pit/PitFuelCalcComponent.vue';

export default {
    components: {
        PitAirPressureComponent,
        PitFuelCalcComponent
    }
}
</script>