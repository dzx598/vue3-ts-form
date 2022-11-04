import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home.vue"),
  },
  {
    path: "/demo",
    name: "demo",
    component: () => import("@/views/demoVue/demo-template.vue"),
  },
  //   {
  //     path: "/axios",
  //     name: "Axios",
  //     component: () => import("@/views/axios.vue"), // 懒加载组件
  //   },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
