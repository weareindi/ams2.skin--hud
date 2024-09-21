<template>
    <div class="c-standings-item">
        <div class="c-standings-item__number" v-if="data.vCarClassPosition[0].label">
            <span class="c-standings-item__value" v-html="data.vCarClassPosition[0].label"></span>
        </div>
        <div class="c-standings-item__details">
            <div class="c-standings-item__name" v-if="data.vNameShort[0].label">
                <span class="c-standings-item__value" v-html="data.vNameShort[0].label"></span>
            </div>
            <div class="c-standings-item__tag" v-if="data.vNameTag[0].label">
                <span class="c-standings-item__value" v-html="data.vNameTag[0].label"></span>
            </div>
            <div class="c-standings-item__car" v-if="data.vCarNamesMain[0].label">
                <span class="c-standings-item__value" v-html="data.vCarNamesMain[0].label"></span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.c-standings-item {
    display: flex;
    align-items: center;
}

.c-standings-item__number {
    @include color('color', 'black');
    @include color('background-color', 'yellow');

    width: em(64);
    height: em(64);

    display: flex;
    justify-content: center;
    align-items: center;

    .c-standings-item__value {
        font-size: em(32);
    }
}

.c-standings-item__details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0 0 0 em(16);
}

.c-standings-item__value {
    font-family: 'uifont', sans-serif;
    line-height: 1em;
}

.c-standings-item__name {
    .c-standings-item__value {
        font-size: em(18);
    }
}

.c-standings-item__tag {
    @include color('color', 'yellow');

    margin: em(2) 0 0;
    border-radius: em(4);

    .c-standings-item__value {
        font-size: em(11);
    }
}

.c-standings-item__car {
    @include color('color', 'white', 0.6);

    margin: em(2) 0 0;
    border-radius: em(4);

    .c-standings-item__value {
        font-size: em(11);
    }
}
</style>

<script>

export default {
    setup() {},
    props: {
        mCarClassColor: null,
        data: null
    },
}
</script>
