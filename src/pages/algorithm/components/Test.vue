<template>
  <div class="container">
    <div class="node" :style="{ color: !root.colorIsBlack ? 'red' : 'unset' }">
      {{ root.data }}
    </div>
    <div class="childContainer">
      <div v-if="root && root.leftChild" class="leftChild">
        <!-- ll -->
        <!-- <slot name="left" /> -->
        <Test :level="level + 1" :root="root.leftChild" />
      </div>
      <div v-if="root && root.rightChild" class="rightChild">
        <!-- rr -->
        <!-- <slot name="right" /> -->
        <Test :level="level + 1" :root="root.rightChild" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Test from "./Test.vue";
const props = defineProps(["root", "level"]);

const root = props.root;
const level = props.level;
</script>

<style scoped lang="scss">
.container {
  // position: absolute;
  min-width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .node {
    font-size: 18px;
    line-height: 18px;
  }
  .childContainer {
    display: flex;
    position: relative;
    > div {
      // overflow: hidden;
      flex: 1;
    }
    .leftChild,
    .rightChild {
      padding-top: 5px;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        width: 1px;
        height: 5px;
        background-color: #000;
      }
    }
    .leftChild {
      transform: translateX(-50%);
    }
    .rightChild {
      transform: translateX(50%);
    }
    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 1px;
      background-color: #000;
    }
    &::before {
      transform: translateX(-100%);
    }
    &::after {
      // transform: translateX(100%);
    }
  }
}
</style>
