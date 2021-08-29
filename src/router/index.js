import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index";

Vue.use(VueRouter);

import Home from "@/views/Home";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "edit",
    path: "/post/:action",
    meta: { edit: true, auth: true },
    component: () => import("@/views/EditPost"),
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/Login"),
  },
  {
    name: "404",
    path: "/:pathMatch(.*)",
    component: () => import("@/views/PageError"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
});

router.beforeEach((to, from, next) => {
  const currentUser = store.getters.user;
  const isRequierAuth = to.matched.some((record) => record.meta.auth);

  if (!currentUser && isRequierAuth) {
    next({ name: "login" });
  } else next();
});

export default router;
