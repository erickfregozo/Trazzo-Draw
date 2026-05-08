import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/splash",
    name: "SplashScreen",
    component: () => import("@/ui/views/splash.vue"),
  },
  {
    path: "/draw",
    name: "Draw",
    component: () => import("@/ui/views/app.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
