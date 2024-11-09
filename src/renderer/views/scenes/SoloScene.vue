<template>
    <div class="s-solo">
        <div class="s-solo__items">
            <div class="s-solo__item" v-if="vData">
                <span class="s-solo__position" v-for="data in vData.vRacePosition">
                    <span v-html="data.value"></span>
                </span>
                <span class="s-solo__info">
                    <span class="s-solo__name" v-for="data in vData.vNameShort">
                        <span v-html="data.value"></span>
                    </span>
                    <span class="s-solo__tag" v-for="data in vData.vNameTag">
                        <span v-html="data.label"></span>
                    </span>
                    <span class="s-solo__aside">
                        <span class="s-solo__car" v-for="data in vData.vCarNamesMain">
                            <span v-html="data.value"></span>

                            <span class="s-solo__class">
                                <span v-html="data.seperator"></span>
                                <span v-html="data.suffix"></span>
                            </span>
                        </span>
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.s-solo {
    @include color('background-color', 'pitbox', 0.8);

    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: em(32);
}

.s-solo__items {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    width: 100%;
    max-width: em(1280);
}

.s-solo__item {
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    // align-items: center;
    justify-content: flex-start;
}

.s-solo__position {
    @include color('background-color', 'yellow');
    @include color('color', 'black');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: em(76);
    line-height: 1em;
    width: em(140, 76);
    height: em(140, 76);
}

.s-solo__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    margin: 0 0 0 em(32);
    // padding: 0 em(128, 48) 0 0;
    padding: em(16) 0
}

.s-solo__name {
    @include color('color', 'primary');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    // padding: 0 em(16, 48) 0 0;
    width: 100%;
    font-size: em(32);
    line-height: 1em;
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.s-solo__tag {
    @include color('background-color', 'primary');
    @include color('color', 'secondary');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    margin: em(12, 18) 0 0;
    padding: em(4, 18) em(6, 18);
    font-size: em(18);
    line-height: 1em;
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-radius: em(2, 18);
}

.s-solo__aside {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;

    display: flex;
    align-items: flex-end;
}

.s-solo__car {
    @include color('color', 'primary-alt');

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    margin: em(12, 18) 0 0;
    font-size: em(18);
    line-height: 1em;
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.s-solo__class {
    @include color('color', 'primary');

    margin: 0 0 0 em(12, 18);

    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>

<script>
import { inject } from 'vue';

export default {
    setup() {
        const vData = inject('vData');

        return {
            vData
        }
    },
}
</script>
