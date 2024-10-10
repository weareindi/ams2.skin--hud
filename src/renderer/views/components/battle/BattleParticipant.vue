<template>
    <div class="s-battle-participant" :active="data.vParticipantIndex[0].additional" :large="large" :invert="invert">
        <div class="s-battle-participant__info">
            <div class="s-battle-participant__name" v-if="data.vNameShort">
                <div class="s-battle-participant__value" v-html="data.vNameShort[0].label"></div>
            </div>
            <div class="s-battle-participant__tag" v-if="data.vNameTag">
                <div class="s-battle-participant__value" v-html="data.vNameTag[0].label"></div>
            </div>
            <div class="s-battle-participant__aside">
                <div class="s-battle-participant__car" v-if="data.vCarNamesMain">
                    <div class="s-battle-participant__value" v-html="data.vCarNamesMain[0].label"></div>
                </div>
            </div>
        </div>
        <div class="s-battle-participant__position" v-if="data.vRacePosition">
            <div class="s-battle-participant__value" v-html="data.vRacePosition[0].label"></div>
            <div class="s-battle-participant__class-position" v-if="data.vRacePosition[0].additional" v-html="data.vRacePosition[0].additional"></div>
        </div>
    </div>
</template>

<style lang="scss">
.s-battle-participant {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: em(320);

    &[active="true"] {
        margin: 0 0 0 em(32);

        &:before {
            @include color('background-color', 'primary');

            content: '';
            position: absolute;
            top: em(-32);
            right: em(-32);
            bottom: em(-32);
            left: em(-32);
            z-index: 1;
        }

        .s-battle-participant__name {
            @include color('color', 'secondary');
        }

        .s-battle-participant__tag {
            @include color('background-color', 'secondary');
            @include color('color', 'primary');
        }

        .s-battle-participant__car {
            @include color('color', 'secondary');
        }
    }

    &[large="true"] {
        .s-battle-participant__position {
            width: em(140);
            height: em(140);
        }

        .s-battle-participant__info {
            padding: em(16) em(32) em(16) 0;
        }
    }

    &[invert="true"] {
        flex-direction: row-reverse;

        .s-battle-participant__info {
            padding: em(8) 0 em(8) em(32);
        }
    }
}

.s-battle-participant__info,
.s-battle-participant__position {
    position: relative;
    z-index: 2;
    // padding: 0 em(32);
}

.s-battle-participant__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;

    padding: em(8) em(32) em(8) 0;
    width: calc(100% - em(100));
}

.s-battle-participant__name {
    @include color('color', 'primary');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    width: 100%;

    .s-battle-participant__value {
        font-size: em(30);
        text-transform: uppercase;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.s-battle-participant__tag {
    @include color('background-color', 'primary');
    @include color('color', 'secondary');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    margin: em(8) 0 0;
    padding: em(4) em(6);
    border-radius: em(4);

    .s-battle-participant__value {
        font-size: em(18);
        text-transform: uppercase;
    }
}

.s-battle-participant__aside {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: flex-end;
    margin: em(8) 0 0;
}

.s-battle-participant__car {
    .s-battle-participant__value {
        font-size: em(16);
        text-transform: uppercase;
    }
}

.s-battle-participant__position {
    @include color('background-color', 'primary');
    @include color('color', 'secondary');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    position: relative;
    width: em(100);
    height: em(100);
    display: flex;
    justify-content: center;
    align-items: center;

    .s-battle-participant__value {
        font-size: em(54);
    }
}

.s-battle-participant__class-position {
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
    text-align: center;
}

</style>

<script>

export default {
    props: {
        large: false,
        invert: false,
        data: null,
    }
}
</script>
