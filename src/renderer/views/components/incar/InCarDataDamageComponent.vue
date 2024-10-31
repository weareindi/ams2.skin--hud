<template>
    <div class="c-in-car-data-damage" :index="index" :state="data.state">
        <span class="c-in-car-data-damage__amount" :style="`clip-path: inset(${data.value * 100}% 0% 0% 0%);`">
            <SvgComponent :svg="icon" fill="true" />
        </span>
        <span class="c-in-car-data-damage__icon">
            <SvgComponent :svg="icon" fill="true" />
        </span>
    </div>
</template>

<style lang="scss">

.c-in-car-data-damage {
    position: relative;
    width: 100%;
    height: 100%;

    &[index="0"] {
    }

    &[index="1"] {
        svg {
            transform: scaleX(-1);
        }
    }

    &[index="2"] {
        svg {
            transform: scaleY(-1);
        }
    }

    &[index="3"] {
        svg {
            transform: scale(-1, -1);
        }
    }

    &[state="0"] {
        // same as default
    }

    &[state="1"] {
        .c-in-car-data-damage__amount {
            svg {
                path {
                    @include color('fill', 'green');
                }
            }
        }
    }

    &[state="2"] {
        .c-in-car-data-damage__amount {
            animation-name: flash;
            animation-duration: 150ms;
            animation-timing-function: linear;
            animation-direction: alternate;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;

            svg {
                path {
                    @include color('fill', 'green');
                }
            }
        }
    }

    &[state="3"] {
        .c-in-car-data-damage__amount {
            svg {
                path {
                    @include color('fill', 'yellow');
                }
            }
        }
    }

    &[state="4"] {
        .c-in-car-data-damage__amount {
            animation-name: flash;
            animation-duration: 150ms;
            animation-timing-function: linear;
            animation-direction: alternate;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;

            svg {
                path {
                    @include color('fill', 'yellow');
                }
            }
        }
    }

    &[state="5"] {
        .c-in-car-data-damage__amount {
            svg {
                path {
                    @include color('fill', 'red');
                }
            }
        }
    }

    &[state="6"] {
        .c-in-car-data-damage__amount {
            animation-name: flash;
            animation-duration: 150ms;
            animation-timing-function: linear;
            animation-direction: alternate;
            animation-fill-mode: forwards;
            animation-iteration-count: infinite;

            svg {
                path {
                    @include color('fill', 'red');
                }
            }
        }
    }
}

.c-in-car-data-damage__amount {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: inset(0% 0% 0% 0%);

    svg {
        path {
            @include color('fill', 'white', 1);
        }
    }
}

.c-in-car-data-damage__icon {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    svg {
        path {
            @include color('fill', 'white', 0.4);
        }
    }
}


</style>

<script>

export default {
    props: {
        index: '',
        icon: '',
        data: {},
    },
}
</script>
