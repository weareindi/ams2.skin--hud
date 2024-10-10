<template>
    <div class="c-standings-item" :active="`${data.vParticipantIndex[0].additional ? 'true' : 'false'}`">
        <div class="c-standings-item__number" v-if="data.vCarClassPosition && data.vCarClassPosition[0].label">
            <div class="c-standings-item__value" v-html="data.vCarClassPosition[0].label"></div>
        </div>
        <div class="c-standings-item__number" v-if="data.vRacePosition && data.vRacePosition[0].label">
            <div class="c-standings-item__value" v-html="data.vRacePosition[0].label"></div>
            <div class="c-standings-item__class-position" v-if="data.vRacePosition[0].additional" v-html="data.vRacePosition[0].additional"></div>
        </div>
        <div class="c-standings-item__details">
            <div class="c-standings-item__name" v-if="data.vNameShort[0].label">
                <span class="c-standings-item__value" v-html="data.vNameShort[0].label"></span>
            </div>
            <div class="c-standings-item__tag" v-if="data.vNameTag[0].label">
                <div class="c-standings-item__value" v-html="data.vNameTag[0].label"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-standings-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    &[active="true"] {
        .c-standings-item__name {
            @include color('color', 'secondary');
        }

        .c-standings-item__tag {
            @include color('background-color', 'secondary');
            @include color('color', 'primary');
        }

        &:before {
            @include color('background-color', 'primary');

            content: '';
            position: absolute;
            top: em(-8);
            right: em(-8);
            bottom: em(-8);
            left: em(-8);
            z-index: 1;
        }
    }
}

.c-standings-item__number,
.c-standings-item__details {
    position: relative;
    z-index: 2;
}

.c-standings-item__number {
    @include color('background-color', 'primary');
    @include color('color', 'secondary');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    width: em(100);
    height: em(100);

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .c-standings-item__value {
        font-size: em(54);
    }
}

.c-standings-item__class-position {
    @include color('background-color', 'secondary');
    @include color('color', 'primary');

    position: absolute;
    top: em(4, 14);
    right: em(4, 14);
    width: em(24, 14);
    height: em(24, 14);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: em(14);
}

.c-standings-item__details {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    // overflow: hidden;

    width: calc(100% - em(100 - 32 - 64));
    padding: 0 0 0 em(32);
}

.c-standings-item__value {
    line-height: 1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.c-standings-item__name {
    @include color('color', 'primary');

    width: 100%;

    .c-standings-item__value {
        font-size: em(42);
        text-transform: uppercase;
    }
}

.c-standings-item__tag {
    @include color('background-color', 'primary');
    @include color('color', 'secondary');

    margin: em(16) 0 0;
    padding: em(4) em(8);
    border-radius: em(4);

    .c-standings-item__value {
        font-size: em(18);
        text-transform: uppercase;
    }
}
</style>

<script>

export default {
    setup() {},
    props: {
        data: null
    },
}
</script>
