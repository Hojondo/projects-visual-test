import { createWebHashHistory, createRouter } from "vue-router";

import HomeView from "./pages/home.vue";
import Algorithm from "./pages/algorithm/index.vue";
import Dragon from "./pages/3D/dragonClothes/NaiLongView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/algorithm", component: Algorithm },
  { path: "/dragon", component: Dragon },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
