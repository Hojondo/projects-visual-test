<template>
    <div class="mask-layer" @touchmove.prevent>
        <div class="bg">
            <background-animation/>
            <div class="content">
                <div class="close-btn" @click="handleClose"></div>
                <high-light-title
                    text=""
                />
                <div class="img" :style="`background-image: url(${shareImg})`">
                    <div class="qr-bar">
                        <div class="qr-info">
                            <div class="qr-info-title">
                                <div class="logo-circle">
                                    <div
                                        class="logo-img"
                                        :style="`background: url('${userInfo.avatar}') no-repeat 100%/100%;`"
                                    ></div>
                                </div>
                                <span class="title-name">{{ userInfo.nickName }}</span>
                                <!-- todo server动态：user info -->
                            </div>
                            <span class="qr-info-content">
                                打开{{ appName }}APP，签到领现金
                            </span>
                        </div>
                        <div class="qr-img-container">
                            <div class="qr-img"></div>
                        </div>
                    </div>
                </div>
                <div class="socialIcons">
                    <share-icon-list
                        :list-keys="['weixin_friend', hideQQShare() ? 'weixin_timeline' : 'qqfriend', 'savelocal']"
                        @shareItemClick="handleShareItemClick"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ShareIconList from '../../../components/actsignin/ShareIconList.vue';
import BackgroundAnimation from '../../actsignin/components/BackgroundAnimation.vue';
import HighLightTitle from '../../actsignin/components/HighLightTitle';
import {getAppName, isIOS, isTomasBox} from '@baidu/matrix-jslib';

export default {
    name: 'ShareDialog',
    props: {
        userInfo: {
            type: Object,
            required: true,
        },
        shareImg: {
            type: String,
            required: true,
        },
        downloadImg: { // 下载 和 展示分享图不同
            type: String,
            required: true,
        },
    },
    components: {
        ShareIconList,
        BackgroundAnimation,
        HighLightTitle
    },

    data() {
        return {
            appName: ''
        };
    },

    mounted() {
        const res = getAppName();
        // baiduboxlite" | "baiduhaokan" | "haokan" | "tomas" | "baiduboxapp
        switch (res) {
            case 'baiduboxapp':
                this.appName = '百度';
                break;
            case 'baiduboxlite':
                this.appName = '百度极速版';
                break;
            case 'tomas':
                this.appName = '百度畅听版';
                break;
            default:
                this.appName = '百度';
                break;
        }
    },

    methods: {
        handleShareItemClick(item) {
            this.$emit('shareItemClick', {...item, shareUrl: this.downloadImg});
        },
        handleClose() {
            this.$emit('close');
        },
        hideQQShare() {
            return isIOS() && isTomasBox();
        }
    },
};
</script>

<style lang="scss" scoped>
@import '../../../bsass/core/mixin.scss';

.mask-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    animation: fadeIn .3s forwards;
    z-index: 998;

    .bg{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        .content{
            margin-top: ptr3(388);
            z-index: 1;
            display: flex;
            align-items: center;
            flex-direction: column;
            position: relative;
            .close-btn {
                align-self: flex-end;
                width: ptr3(88);
                height: ptr3(88);
                position: absolute;
                top: ptr3(22);
                z-index: 10;
                background: url('https://matrix-fe.cdn.bcebos.com/act/actraffle/close-btn.png') no-repeat;
                background-size: 100% 100%;
            }
            .img{
                width: ptr3(948);
                height: ptr3(1195);
                background-repeat: no-repeat;
                background-size: contain;
                flex-shrink: 0;
                position: relative;
                // background-size: 100% 100%;
                animation: scaleRotateAnimation 0.7s forwards;
                .qr-bar{
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    box-sizing: border-box;
                    bottom: ptr3(93);
                    width: ptr3(766);
                    height: ptr3(193);
                    padding: 0 ptr3(60);
                    border-radius: ptr3(193);
                    border: 1px solid #FFD9D950;
                    background: #FFF;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .qr-info{
                        display: flex;
                        flex-direction: column;
                        .qr-info-title{
                            display: flex;
                            align-items: center;
                            margin-bottom: ptr3(9);
                            .logo-circle{
                                position: relative;
                                width: ptr3(97);
                                height: ptr3(97);
                                border-radius: ptr3(97);
                                border: ptr3(3) solid #D2D2D2;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                overflow: hidden;
                                .logo-img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .title-name{
                                margin-left: ptr3(27);
                                color: #000;
                                font-family: "PingFang SC";
                                font-size: ptr3(42);
                                font-style: normal;
                                font-weight: 600;
                            }
                        }
                        .qr-info-content{
                            color: #000;
                            font-family: "PingFang SC";
                            font-size: ptr3(30);
                            font-style: normal;
                            font-weight: 400;
                        }

                    }
                    .qr-img-container{
                        width: ptr3(151);
                        height: ptr3(151);
                        padding: ptr3(10);
                        border: 1px solid #ffd6ba50;
                        border-radius: ptr3(10);
                        box-sizing: border-box;
                        .qr-img{
                            width: 100%;
                            height: 100%;
                            background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/share-qr.png') no-repeat;
                            background-size: contain;
                        }
                    }
                }
            }
            .socialIcons{
                margin-top: ptr3(206);
            }
        }
    }

}
@keyframes fadeIn {
    from, to {
        animation-timing-function: cubic-bezier(0.3, 0.2, 0.2, 1)
    }
    from {
        background-color: rgba(0, 0, 0, 0)
    }
    to {
        background-color: rgba(0, 0, 0, .8)
    }
}
@keyframes scaleRotateAnimation {
    0% {
        transform: scale(0) rotateY(270deg);
    }
    100% {
        transform: scale(1) rotateY(0deg);
    }
}

</style>
