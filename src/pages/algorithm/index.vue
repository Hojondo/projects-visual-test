<template>
  <div
    style="
      background-color: #fff;
      position: sticky;
      top: 0;
      z-index: 9;
      padding: 2vh 0;
    "
  >
    <label
      >添加：<input v-model="addV" type="number" @keydown.enter="handleInsert"
    /></label>
  </div>
  <div
    v-for="t in resHistory"
    :key="t.root?.data"
    style="border-bottom: 1px solid orange; padding: 1em 0"
  >
    <Test :root="t.root" :level="1" />
  </div>
  <div />

  <div />
</template>

<script setup lang="ts">
import { onUpdated, ref } from "vue";
import Test from "./components/Test.vue";
import Fn from "./Tree";
const fn = Fn();

// const { proxy } = getCurrentInstance();

let resHistory = fn.getHistory();
const addV = ref<number | null>(1);
const handleInsert = () => {
  typeof addV.value === "number" && fn.add(addV.value);
  resHistory = fn.getHistory();
  addV.value = null;
  // proxy.$forceUpdate()
};

onUpdated(() => {
  const appDom = document.querySelector("#app")!;
  appDom.scrollTop = appDom.scrollHeight * 2;
});
</script>

<style scoped></style>
