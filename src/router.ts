import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./pages/home.vue";
import Algorithm from "./pages/algorithm/index.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/algorithm", component: Algorithm },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
