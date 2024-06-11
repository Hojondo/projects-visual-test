<template>
  <div class="naiLong-wp">
    <div class="content">
      <div class="canvas-container">
        <div class="canvas-bg"></div>
        <ThreeCanvas
          v-if="selectedInfo.id"
          :selected-id="selectedInfo.id"
          @setReady="handleCanvasReady"
          @updateIfIsLoadingClothes="handleUpdateIfIsLoadingClothes"
        />
        <div v-if="!supportGL2">!support GL2</div>
      </div>
      <div class="list-container">
        <div class="list-title-container">
          <div class="list-title">
            <icons-svg icon="listTitle" class="list-title-icon" />
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
    </div>
    <div class="info-bar">
      <div class="content-container">
        <div>
          <div class="info-bar-title">
            <span class="title-name">{{ selectedInfo.name }}</span>
            <div v-if="+selectedInfo.type === 1" class="title-tag"></div>
          </div>
          <div class="status">
            {{ selectedInfo.gainStatus ? "已拥有" : "未获得" }}
          </div>
        </div>
        <div
          :class="['btn', selectedInfo.useStatus ? 'isUsing' : '']"
          @click="handleBtn"
        >
          {{
            selectedInfo.useStatus
              ? "当前装扮"
              : selectedInfo.gainStatus
                ? "保存装扮"
                : "去抽奖获得"
          }}
        </div>
      </div>
    </div>

    <div v-if="!sceneReady" class="loading">
      <div class="loadingIcon"></div>
      <span class="loadingTip">loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, ref } from 'vue'

import ClothesItem from "./components/ClothesItem.vue";
import ThreeCanvas from "./components/ThreeCanvas.vue";
import IconsSvg from "./components/IconsSvg.vue";

import mockData from "./mock_data.json";
import {preloadSrc} from "@/utils";
export default defineComponent({
  name: "NaiLongView",
  components: {
    ClothesItem,
    ThreeCanvas,
    IconsSvg,
  },
  props: {
    initData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      clothesList: [],
      selectedId: 1, // 默认选中第一个
      currentUseID: 1, // 暂存server存储的当前穿戴id
      isLoadingClothes: false,
      supportGL2: true,
      sceneReady: false,
    };
  },
  computed: {
    selectedInfo() {
      return this.clothesList.find(item => item.id === this.selectedId) || {};
    },
  },
  watch: {},
  created() {
    preloadSrc('https://xxx/draw-afx.mp4').then(res => {
        this.preloadData.drawAfx = res;
    });
  },
  mounted() {
    this.getLoadData();
  },
  destroyed() {},
  methods: {
    handleCanvasReady(bl) {
      this.supportGL2 = bl;
      this.sceneReady = true;
    },
    handleUpdateIfIsLoadingClothes(bool) {
      this.isLoadingClothes = bool;
    },
    getLoadData() {
      const list = mockData.data;
      this.clothesList = list || [];
      const selectedID = list.find(item => item?.useStatus)?.id;
      this.currentUseID = selectedID || 1;
      this.selectedId = selectedID || 1;
    },

    handleSelectClothe(id) {
      // todo 异步请求衣服物料中 禁止切换
      if (!this.isLoadingClothes) {
        this.selectedId = id;
      }
    },

    handleSaveCloth(clothingInfo) {
      alert("save api");
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
      } else {
      }
    },
  },
});
</script>

<style lang="scss">
@import "./styles/_vars";
@import "./styles/_reset";
@include reset();
html {
  font-size: 100px;
}
@media screen and (min-width: 260px) {
  html {
    font-size: 62.8019px;
  }
}
@media screen and (min-width: 280px) {
  html {
    font-size: 67.7031px;
  }
}
@media screen and (min-width: 310px) {
  html {
    font-size: 74.8791px;
  }
}
@media screen and (min-width: 320px) {
  html {
    font-size: 77.2946px;
  }
}
@media screen and (min-width: 360px) {
  html {
    font-size: 86.9565px;
  }
}
@media screen and (min-width: 375px) {
  html {
    font-size: 90.5797px;
  }
}
@media screen and (min-width: 393px) {
  html {
    font-size: 94.9275px;
  }
}
@media screen and (min-width: 400px) {
  html {
    font-size: 96.6183px;
  }
}
@media screen and (min-width: 414px) {
  html {
    font-size: 100px;
  }
}
@media screen and (min-width: 440px) {
  html {
    font-size: 106.2801px;
  }
}
@media screen and (min-width: 480px) {
  html {
    font-size: 115.942px;
  }
}
@media screen and (min-width: 520px) {
  html {
    font-size: 125.6038px;
  }
}
@media screen and (min-width: 560px) {
  html {
    font-size: 135.2657px;
  }
}
@media screen and (min-width: 600px) {
  html {
    font-size: 144.9275px;
  }
}
@media screen and (min-width: 640px) {
  html {
    font-size: 154.5893px;
  }
}
@media screen and (min-width: 680px) {
  html {
    font-size: 164.2512px;
  }
}
@media screen and (min-width: 720px) {
  html {
    font-size: 173.913px;
  }
}
@media screen and (min-width: 760px) {
  html {
    font-size: 183.5748px;
  }
}
@media screen and (min-width: 800px) {
  html {
    font-size: 193.2367px;
  }
}
@media screen and (min-width: 960px) {
  html {
    font-size: 231.884px;
  }
}
@media screen and (min-width: 1024px) {
  html {
    font-size: 246.276px;
  }
}
</style>
<style lang="scss" scoped>
@import "./styles/_mixin.scss";

.naiLong-wp {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  background-size: 100% 100%;
  user-select: none;

  .egg-twisting-dialog {
    z-index: 9;
  }

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .canvas-container {
      width: 100%;
      height: ptr3(1243); // 1094 - (100 + 170) - (1243 - 1094)
      margin: 0 auto;
      background: linear-gradient(
        180deg,
        #c4ff88 0%,
        #eafed8 28.65%,
        #fff 81.3%
      );
      flex-shrink: 0;
      touch-action: none;
      box-sizing: border-box;
      padding-top: ptr3(270);
      padding-bottom: ptr3(149); // 保证渐变bg对齐canvasBg.svg

      .canvas-bg {
        position: absolute;
        top: ptr3(221);
        left: 50%;
        transform: translateX(-50%);
        width: ptr3(742);
        height: ptr3(742);
        background: url("./assets/canvas-bg.png") no-repeat;
        background-size: 100% 100%;
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
      background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0) 0%,
          #fff 14.39%
        ),
        linear-gradient(90deg, #fff8fc 0%, #f0f7fd 103.26%);

      .list-title-container {
        margin-top: ptr3(104);
        margin-bottom: ptr3(81);
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        .list-title {
          position: relative;
          font-size: ptr3(50);
          font-style: normal;
          font-weight: 400;
          color: #212121;
          text-align: center;
          font-family: FZMoDTJW_Te;
          font-weight: 800;
          .list-title-icon {
            position: absolute;
            bottom: 0;
            left: ptr3(-31);
            width: ptr3(88.943);
            // height: ptr3(88.938);
          }
          > span {
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
    background: linear-gradient(
      90deg,
      #f7efff 0.1%,
      #ddf7fe 48.34%,
      #def7dc 99.88%
    );
    .content-container {
      position: relative;
      top: ptr3(300 - 90 - 182); // NA返回按钮高度50px,btmMargin 24px
      width: 100%;
      height: ptr3(182); // 高度和back按钮保持一致，居中对齐
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-bar-title {
      display: flex;
      align-items: center;
      .title-name {
        color: #000;
        font-family: PingFang SC;
        font-size: ptr3(48);
        font-style: normal;
        font-weight: 600;
        letter-spacing: 1px;
        margin-right: ptr3(46);
      }
      .title-tag {
        width: ptr3(125.961);
        height: ptr3(57.255);
        background: url("./assets/dragonClothesTag.png") no-repeat;
        background-size: contain;
      }
    }
    .status {
      margin-top: ptr3(9);
      color: rgba(0, 0, 0, 0.7);
      text-align: left;
      font-family: PingFang SC;
      font-size: ptr3(44);
      font-style: normal;
      font-weight: 400;
      letter-spacing: 1px;
    }
    .btn {
      width: ptr3(445);
      height: ptr3(116);
      line-height: ptr3(116);
      border-radius: ptr3(300);
      background: linear-gradient(95deg, #ff719c 0%, #ff467e 100%);
      color: #fff;
      text-align: center;
      font-family: PingFang SC;
      font-size: ptr3(52);
      font-style: normal;
      font-weight: 500;
      border: 1px solid transparent;

      &.isUsing {
        border-color: #ff467e;
        background: transparent;
        color: #ff4e84;
      }
    }
  }

  .loading {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    background: url("./assets/loading-bg.jpg") no-repeat;
    background-size: 100% 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .loadingIcon {
      width: ptr3(177);
      height: ptr3(177);
      background: url("./assets/loading-icon.png") no-repeat;
      background-size: 100% 100%;
    }
    .loadingTip {
      margin-top: ptr3(86);
      color: #fff;
      font-family: PingFang SC;
      font-size: ptr3(77);
      font-style: normal;
      font-weight: 600;
    }
  }
}
</style>
