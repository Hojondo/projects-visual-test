<template>
    <div :class="['item-container', active ? 'selected' : '']" @click.stop="handleSelectClothe">
        <div class="rect">
            <div class="bordered"></div>
            <div
                :class="['img', !info.gainStatus ? 'ungain' : '']"
                :style="{backgroundImage: `url(${info.url})`}"
            ></div>
            <div v-if="+info.type === 1" class="type"></div>
            <div v-if="info.gainStatus && info.count > 1" class="num">x{{ info.count }}</div>
            <div v-if="!info.gainStatus" class="lock-wp">
                <icons-svg icon="lock" class="lock"/>
            </div>
        </div>
        <div class="name">{{ info.name }}</div>
    </div>
</template>

<script>
// import Vue from 'vue';

import IconsSvg from './IconsSvg.vue';
export default {
    props: {
        info: {
            type: Object,
            default: () => ({})
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    components: {
        IconsSvg,
    },
    methods: {
        handleSelectClothe() {
            this.$emit('selectItem', this.info.id);
        },
    },

};

</script>

<style lang="scss" scoped>
@import '../../../bsass/core/mixin.scss';


    .item-container {
        position: relative;
        &.selected{
            .rect .bordered{
                border-color: #FF467E;
            }
            .name{
                color: #FF467E;
            }

        }
        .rect {
            position: relative;
            width: ptr3(360);
            height: ptr3(360);
            margin: 0 auto ptr3(10);
            border-radius: ptr3(36);

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .type{
                position: absolute;
                top: ptr3(23);
                right: ptr3(16.4);
                width: ptr3(125.961);
                height: ptr3(57.255);
                background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragonClothesTag.png') no-repeat;
                background-size: contain;
            }
            .num, .lock-wp{
                position: absolute;
                bottom: ptr3(16);
                right: ptr3(23);
                width: ptr3(100);
                height: ptr3(60);
                border-radius: ptr3(36);
                background-color: rgba(255, 70, 126, 0.30);
                color: #FF467E;
            }
            .num{
                text-align: center;
                font-family: PingFang SC;
                font-size: ptr3(36);
                font-weight: 500;
            }

            .lock-wp{
                display: flex;
                align-items: center;
                justify-content: center;
                .lock{
                    width: ptr3(28);
                }
            }

            .bordered{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: ptr3(36);
                border-width: ptr3(2);
                border-style: solid;
                border-color: transparent;
            }
            .img{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                height: ptr3(400);
                width: ptr3(400);
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                &.ungain{
                    opacity: 0.3;
                }
            }
        }

        .name {
            color: #212121;
            text-align: center;
            font-family: PingFang SC;
            font-size: ptr3(36);
            font-style: normal;
            font-weight: 500;
        }
    }

</style>
