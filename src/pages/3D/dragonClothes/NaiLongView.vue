
<template>
    <div class="naiLong-wp">
        <div class="content">
            <div class="canvas-container" @touchmove.prevent>
                <div class="canvas-bg"></div>
                <three-canvas
                    v-if="supportGL2 && selectedInfo.id"
                    :selected-id="selectedInfo.id"
                    @checkSupportGL2="handleSupportGL2"
                    @updateIfIsLoadingClothes="handleUpdateIfIsLoadingClothes"
                />
                <div
                    v-if="!supportGL2 && selectedInfo.staticUrl"
                    class="static-dom"
                    :style="{backgroundImage: `url(${selectedInfo.staticUrl})`}"
                >
                    {{ text }}
                </div>
            </div>
            <div class="list-container">
                <div class="list-title-container">
                    <div class="list-title">
                        <icons-svg icon="listTitle" class="list-title-icon"/>
                        <span>奶龙试衣间</span>
                    </div>
                </div>
                <div class="list-grid">
                    <clothes-item
                        v-for="item in clothesList"
                        :key="item.id"
                        :info="item"
                        :active="selectedId === item.id"
                        @selectItem="handleSelectClothe"
                    />
                </div>
            </div>
            <div class="title-bar">
                <div class="title">
                    <div class="title-icon-baidu"></div>
                    <div class="title-icon-dragon"></div>
                </div>
            </div>
            <div
                v-show="selectedInfo.gainStatus"
                class="share-btn"
                @click="handleShareBtnClick"
            >
                <icons-svg icon="export" class="share-icon"/>
                <div v-if="shareTip" class="share-tag"></div>
                <div v-if="showGuideShareHand" class="hand"></div>
            </div>
        </div>
        <div class="info-bar">
            <div class="content-container">
                <div>
                    <div class="info-bar-title">
                        <span class="title-name">{{ selectedInfo.name }}</span>
                        <div v-if="+selectedInfo.type === 1" class="title-tag"></div>
                    </div>
                    <span class="status">{{ selectedInfo.gainStatus ? '已拥有' : '未获得' }}</span>
                </div>
                <div
                    :class="['btn', selectedInfo.useStatus ? 'isUsing' : '']"
                    @click="handleBtn"
                >{{ selectedInfo.useStatus ? '当前装扮' : (selectedInfo.gainStatus ? '保存装扮' : '去抽奖获得') }}</div>
            </div>
        </div>

        <share-dialog
            v-if="showShare"
            :share-img="selectedInfo.shareUrl"
            :download-img="selectedInfo.downloadUrl"
            :user-info="userInfo"
            @close="closeShareDialog"
            @shareItemClick="handleShareItemClick"
        />

        <egg-twisting-dialog
            v-if="showEggTwistingDialog"
            class="egg-twisting-dialog"
            :show-mask="true"
            :in-nai-long-page="true"
            :has-task-list="hasTaskList"
            :has-share-icon="selectedInfo.gainStatus && selectedInfo.id !== 1"
            :dialog-data="eggTwistingDialogData"
            @handleGuideShare="handleEggTwistingGuideShare"
            @handleConfirm="handleEggTwistingShare"
            @routerToWithdraw="handleRouterToWithdraw"
            @handleClose="handleTwistingDialogClose"
            @handleTryOnClothe="handleTryOnClothe"
        />

        <div v-if="!sceneReady" class="loading">
            <div class="loadingIcon"></div>
            <span class="loadingTip">loading...</span>
        </div>
        <h5-back-icon
            :is-show="true"
            @handleExit="getRequestExit"
        />
    </div>
</template>

<script>
import {showToast} from 'lib/toast';
import {shareImg} from 'lib/share';
import MatrixApi from 'lib/api/create-api-client-actsignin';
import {easyBrowserOpen} from 'lib/easyBrowserOpen';
import {queryToJson, jsonToQuery, invokeCloseWindow, getBlackInfoParams, hideNABackBtn} from '@baidu/matrix-jslib';
import {getErrorToast} from './const';
import UbcLogger from 'lib/logger/ubcLogger';
import Vue from 'vue';
import H5BackIcon from 'components/H5BackIcon.vue';
import ClothesItem from './components/ClothesItem.vue';
import ShareDialog from './components/ShareDialog.vue';
import ThreeCanvas from './components/ThreeCanvas.vue';
import EggTwistingDialog from '../actsignin/components/Dialog/eggTwistingMachineDialog/EggTwistingMachine.vue';
import CONST_VALUES from '../actsignin/const';
import utils from 'lib/utils';
import {throttle} from 'throttle-debounce';
import IconsSvg from './components/IconsSvg.vue';

let logger;
let savePhotoToAlbum;
// 打点初始化
if (!V_SSR) {
    logger = UbcLogger.getInstance();
    Vue.use(logger);
    savePhotoToAlbum = require('@baidu/ug-matrix').savePhotoToAlbum;
}

export default {
    name: 'NaiLongView',
    components: {
        ClothesItem,
        ShareDialog,
        ThreeCanvas,
        EggTwistingDialog,
        IconsSvg,
        H5BackIcon
    },
    props: {
        initData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            clothesList: [],
            selectedId: 1, // 默认选中第一个
            currentUseID: 1, // 暂存server存储的当前穿戴id
            showShare: false,
            supportGL2: true,
            showEggTwistingDialog: false,
            shareTip: false,
            blackInfo: {},
            eggTwistingDialogData: {},
            actID: '',
            appname: '', // 活动所在端,baiduboxapp/baiduboxlite/haokan/tomas
            flagShared: false,
            isLoadingClothes: false,
            showGuideShareHand: false,
            sceneReady: false,
            tryClothingID: '',
            userInfo: {},
        };
    },
    computed: {
        selectedInfo() {
            return this.clothesList.find(item => item.id === this.selectedId) || {};
        }
    },
    watch: {},
    created() {
        logger.init('normal', {
            serverId: CONST_VALUES.loggerId,
            page: 'nailong_page',
        });
        const {actID = '', guideShare, tryClothingID = '', hasTaskList} = queryToJson() || {};
        this.actID = actID;
        this.showGuideShareHand = guideShare === 'true';
        this.hasTaskList = hasTaskList === 'true';

        if (tryClothingID) {
            this.tryClothingID = +tryClothingID;
            this.selectedId = +tryClothingID;
        }

        setTimeout(() => {
            this.showGuideShareHand = false;
        }, 5000);
        this.appname = utils.getAppName();
    },
    mounted() {
        hideNABackBtn();
        logger.logCommon({
            type: 'show',
            value: 'nailong_page'
        });
        // 获取防黑产公参后 才 get list
        getBlackInfoParams().then(blackInfo => {
            blackInfo && typeof blackInfo === 'object' && this.getLoadData(blackInfo);
        });

        this.initEggTwistingDialogData();

        // 监听页面resume
        utils.onWebviewResume(
            throttle(500, () => {
                // 在分享回来resume时机，根据flag展示toast
                if (this.flagShared) {
                    showToast({message: '分享成功，恭喜获得一次抽奖机会～'});
                    this.flagShared = false;
                }
                // 请求需要调的接口来更新数据
                this.getLoadData(this.blackInfo, true);
            }),
            {
                preserveCallback: true
            }
        );
    },
    destroyed() { },
    methods: {
        getRequestExit() {
            invokeCloseWindow();
        },
        handleSupportGL2(bl) {
            this.supportGL2 = bl;
            this.sceneReady = true;
        },
        handleUpdateIfIsLoadingClothes(bool) {
            this.isLoadingClothes = bool;
        },
        getLoadData(blackInfo, isFromResume = false) {
            if (!this.actID) {
                showToast({message: getErrorToast});
                return;
            }
            MatrixApi.getDragonList({actID: this.actID, ...blackInfo}).then(res => {
                if (res && +res.errno === 0) {
                    const {
                        isFirstShare, // 是首次分享
                        total,
                        list,
                        user
                    } = res.data || {};
                    this.clothesList = list || [];
                    this.shareTip = total > 1 && isFirstShare;
                    this.userInfo = user;
                    const selectedID = list.find(item => item?.useStatus)?.id;
                    this.currentUseID = selectedID || 1;
                    !isFromResume
                        && !this.tryClothingID
                        && (this.selectedId = selectedID || 1); // 如果接口错误，未找到穿戴中服装，则默认选择第一个

                }
            }).catch(err => {
                showToast({message: getErrorToast});
            });
        },

        handleSelectClothe(id) {
            // todo 异步请求衣服物料中 禁止切换
            if (!this.isLoadingClothes) {
                this.selectedId = id;
            }
        },
        handleTryOnClothe(id) {
            this.tryClothingID = +id;
            this.selectedId = +id;
        },

        handleSaveCloth(clothingInfo) {
            logger.logCommon({
                type: 'click',
                value: 'save'
            });

            MatrixApi.postDrawAction({
                bodyParams: {
                    clothingID: clothingInfo?.id,
                    actID: this.actID,
                }
            }).then(res => {
                if (res && +res.errno === 0) {
                    showToast({message: '换装成功'});
                    invokeCloseWindow();
                }
                else {
                    showToast({message: '换装失败'});
                }
            }).catch(err => {
                showToast({message: '换装失败'});
            });
        },
        handleShowEgg() {
            logger.logCommon({
                type: 'click',
                value: 'lottery'
            });
            this.showEggTwistingDialog = true;
        },
        handleShareBtnClick() {
            this.showShare = true;
            logger.logCommon({
                type: 'click',
                value: 'share'
            });
        },
        closeShareDialog() {
            this.showShare = false;
        },
        handleShareItemClick(item) {
            // 分享+1 接口
            if (this.shareTip) {
                MatrixApi.postShareData({
                    bodyParams: {
                        actID: this.actID,
                        shareFrom: 'dragon',
                    }
                }).then(() => {
                    this.flagShared = true; // 更新flag，供resume事件依据判断是否toast成功
                }).catch(err => {
                    // 分享失败
                });
            }
            if (item.inviteType === 'savelocal') {
                savePhotoToAlbum({
                    // 分享图片
                    imageUrl: item?.shareUrl
                }).then(() => {
                    // 百度APP会有自带的toast，极速版需要主动弹toast
                    const appArr = ['baiduboxlite', 'tomas'];
                    if (appArr.includes(this.appname)) {
                        showToast({message: '保存成功，去发送给好友吧'});
                    }
                });
            }
            // 这里统一放分享icon 逻辑
            if (['weixin_friend', 'qqfriend', 'weixin_timeline'].includes(item.inviteType)) {
                shareImg({
                    imageUrl: item?.shareUrl,
                    mediaType: item.inviteType
                });
            }
        },
        handleEggTwistingGuideShare() {
            // 添加: 扭蛋返回后，选中useStatus为true的服装，并展示分享引导
            this.selectedId = this.currentUseID;

            this.showGuideShareHand = true;
            setTimeout(() => {
                this.showGuideShareHand = false;
            }, 5000);
        },
        handleEggTwistingShare(btnInfo) {
            if (btnInfo.inviteType === 'savelocal') {
                savePhotoToAlbum({
                    // 分享图片
                    imageUrl: btnInfo?.shareUrl
                }).then(() => {
                    // 百度APP会有自带的toast，极速版需要主动弹toast
                    if (this.appname === 'baiduboxlite') {
                        showToast({message: '保存成功，去发送给好友吧'});
                    }
                });
            }
            // qq好友
            if (['weixin_friend', 'qqfriend', 'weixin_timeline'].includes(btnInfo.inviteType)) {
                shareImg({
                    imageUrl: btnInfo?.shareUrl,
                    mediaType: btnInfo.inviteType
                });
            }
            if (btnInfo.inviteType === 'dressUp') {
                this.showEggTwistingDialog = false;
            }
        },
        handleRouterToWithdraw() {
            const {actID} = queryToJson() || {};
            const query = {
                actID,
                actType: 'cny', // 大坑：这里的actType和签到的'cny_signin'还不太一样
                operationPosition: 'signin_shouye', // 钱包打点from为指定的签到页首页
                ...this.blackInfo
            };
            easyBrowserOpen({
                path: `walletincome?${jsonToQuery(query)}`,
                addParams: '1',
                type: 'immerse',
                backlocation: '1',
                bannerswitch: '1',
            });
        },
        initEggTwistingDialogData() {
            this.eggTwistingDialogData = {
                actID: this.actID
            };
        },
        handleTwistingDialogClose() {
            this.showEggTwistingDialog = false;
            this.getLoadData(this.blackInfo, true);
        },
        handleBtn() {
            const useStatus = this.selectedInfo.useStatus;
            if (useStatus) {
                // 装扮中，不做任何操作
                return;
            }
            const gainStatus = this.selectedInfo.gainStatus;
            if (gainStatus) {
                // 保存装扮
                this.handleSaveCloth(this.selectedInfo);
            }
            else {
                // 去抽奖
                this.handleShowEgg();
            }
        }
    }
};
</script>

<style  lang="scss" scoped>
@import '../../bsass/core/mixin.scss';

.naiLong-wp {
    width: 100vw;
    height: 100vh;
    background-color: #FFF;
    background-size: 100% 100%;
    user-select: none;

    .egg-twisting-dialog {
        z-index: 9;
    }

    .content{
        display: flex;
        flex-direction: column;
        height: 100%;

        .canvas-container {
            width: 100%;
            height: ptr3(1243); // 1094 - (100 + 170) - (1243 - 1094)
            margin: 0 auto;
            background: linear-gradient(180deg, #C4FF88 0%, #EAFED8 28.65%, #FFF 81.3%);
            flex-shrink: 0;
            touch-action: none;
            box-sizing: border-box;
            padding-top: ptr3(270);
            padding-bottom: ptr3(149); // 保证渐变bg对齐canvasBg.svg

            .canvas-bg{
                position: absolute;
                top: ptr3(221);
                left: 50%;
                transform: translateX(-50%);
                width: ptr3(742);
                height: ptr3(742);
                background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/canvas-bg.png') no-repeat;
                background-size: 100% 100%;
            }
            .static-dom{
                position: relative;
                width: 100%;
                height: 100%;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
            }
        }

        .list-container {
            flex: 1;
            // overflow: hidden;
            overflow-y: auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            padding: 0 ptr3(40) ptr3(300);
            box-sizing: border-box;
            margin-top: ptr3(-149);
            border-radius: ptr3(80);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 14.39%),
            linear-gradient(90deg, #FFF8FC 0%, #F0F7FD 103.26%);

            .list-title-container {
                margin-top: ptr3(104);
                margin-bottom: ptr3(81);
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
                .list-title{
                    position: relative;
                    font-size: ptr3(50);
                    font-style: normal;
                    font-weight: 400;
                    color: #212121;
                    text-align: center;
                    font-family: FZMoDTJW_Te;
                    font-weight: 800;
                    .list-title-icon{
                        position: absolute;
                        bottom: 0;
                        left: ptr3(-31);
                        width: ptr3(88.943);
                        // height: ptr3(88.938);
                    }
                    >span{
                        position: relative;
                    }

                }
            }

            .list-grid {
                width: 100%;
                // flex: 1;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                row-gap: ptr3(42);
                // column-gap: ptr3(41);

            }
        }

        .title-bar, .share-btn, .back-icon{
            position: absolute;
        }
        .hand {
            width: ptr3(200);
            height: ptr3(163);
            background: url('https://matrix-fe.cdn.bcebos.com/act/signin/guide-hand-left.png') no-repeat;
            background-size: 100% auto;
            position: absolute;
            right: ptr3(100);
            top: ptr3(60);
            animation: handMove 1s linear infinite;
            @keyframes handMove {
                0% {
                    transform: none;
                }
                70% {
                    transform: translate(10px, -10px);
                }
                100% {
                    transform: none;
                }
            }
        }
        .title-bar {
            width: 100%;
            top: ptr3(170);
            display: flex;
            align-items: center;
            justify-content: center;
            .title{
                width: ptr3(622);
                height: ptr3(100);
                border-radius: ptr3(30);
                background: rgba(255, 255, 255, 0.30);
                display: flex;
                align-items: center;
                justify-content: center;
                .title-icon-baidu{
                    width: ptr3(137);
                    height: ptr3(53);
                    margin-right: ptr3(51);
                    position: relative;
                    background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/icon_baidu.png') no-repeat;
                    background-size: 100% 100%;
                    &::after{
                        content: "";
                        position: absolute;
                        width: ptr3(1.5);
                        height: ptr3(34);
                        border-radius: 2px;
                        background: #000;
                        right: ptr3(-26);
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .title-icon-dragon{
                    width: ptr3(308);
                    height: ptr3(68);
                    background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/icon_nailong.png') no-repeat;
                    background-size: 100% 100%;
                    align-self: flex-end;
                }
            }
        }
        .share-btn{
            width: ptr3(100);
            height: ptr3(100);
            top: ptr3(171);
            right: ptr3(48);
            .share-icon{
                width: 100%;
                height: 100%;
            }

            .share-tag{
                position: absolute;
                right: 0;
                top: ptr3(113.4);
                width: ptr3(242.6);
                height: ptr3(83.6);
                background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/share-tip.png') no-repeat;
                background-size: cover;
            }
        }
        .back-icon{
            top: ptr3(194);
            left: 0;
            padding-left: ptr3(60);
            width: ptr3(30);
        }
    }
    .info-bar {
        position: fixed;
        z-index: 9;
        bottom: 0;
        left: 0;
        width: 100%;
        height: ptr3(300);
        box-sizing: border-box;
        padding: 0 ptr3(72) 0 ptr3(30 * 2 + 182); // 返回按钮左右间距一致30
        border-radius: ptr3(60) ptr3(60) 0px 0px;
        background: linear-gradient(90deg, #F7EFFF 0.1%, #DDF7FE 48.34%, #DEF7DC 99.88%);
        .content-container{
            position: relative;
            top: ptr3(300 - 90 - 182); // NA返回按钮高度50px,btmMargin 24px
            width: 100%;
            height: ptr3(182); // 高度和back按钮保持一致，居中对齐
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .info-bar-title{
            display: flex;
            align-items: center;
            .title-name{
                color: #000;
                font-family: PingFang SC;
                font-size: ptr3(48);
                font-style: normal;
                font-weight: 600;
                letter-spacing: 1px;
                margin-right: ptr3(46);

            }
            .title-tag{
                width: ptr3(125.961);
                height: ptr3(57.255);
                background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragonClothesTag.png') no-repeat;
                background-size: contain;
            }
        }
        .status{
            margin-top: ptr3(9);
            color: rgba(0, 0, 0, 0.70);
            text-align: center;
            font-family: PingFang SC;
            font-size: ptr3(44);
            font-style: normal;
            font-weight: 400;
            letter-spacing: 1px;
        }
        .btn{
            width: ptr3(445);
            height: ptr3(116);
            line-height: ptr3(116);
            border-radius: ptr3(300);
            background: linear-gradient(95deg, #FF719C 0%, #FF467E 100%);
            color: #FFF;
            text-align: center;
            font-family: PingFang SC;
            font-size: ptr3(52);
            font-style: normal;
            font-weight: 500;
            border: 1px solid transparent;

            &.isUsing {
                border-color: #FF467E;
                background: transparent;
                color: #FF4E84;
            }
        }
    }

    .loading{
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;

        background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/loading-bg.jpg') no-repeat;
        background-size: 100% 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .loadingIcon{
            width: ptr3(177);
            height: ptr3(177);
            background: url('https://matrix-fe.cdn.bcebos.com/act/signin/dragon/loading-icon.png') no-repeat;
            background-size: 100% 100%;
        }
        .loadingTip{
            margin-top: ptr3(86);
            color: #FFF;
            font-family: PingFang SC;
            font-size: ptr3(77);
            font-style: normal;
            font-weight: 600;
        }
    }
}
</style>
