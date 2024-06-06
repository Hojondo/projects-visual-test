<template>
  <div style="background-color: #fff; position: sticky;top: 0;z-index: 9;padding: 2vh 0;">
    <label>添加：<input type="number" v-model="addV" @keydown.enter="handleInsert"></label>
  </div>
  <div v-for="t in resHistory" style="border-bottom: 1px solid orange;padding: 1em 0;">
    <Test :root="t.root" :level="1" />
  </div>
  <div></div>
  <div/>
</template>

<style scoped></style>


<script setup lang="ts">
import { onUpdated, ref } from "vue";
import Test from './components/Test.vue'
import Fn from './Tree'
const fn = Fn();

// const { proxy } = getCurrentInstance();



let resHistory = fn.getHistory()
const addV = ref<number | null>(1)
const handleInsert = () => {
  (typeof addV.value === 'number') && fn.add(addV.value);
  resHistory = fn.getHistory();
  addV.value = null
  // proxy.$forceUpdate()
}

onUpdated(() => {
  const appDom = document.querySelector('#app')!
  appDom.scrollTop = appDom.scrollHeight * 2;
})

</script>