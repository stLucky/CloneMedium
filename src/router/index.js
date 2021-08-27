import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Home from "@/views/Home";
import PageError from "@/views/PageError";
import EditPost from "@/views/EditPost";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "edit",
    path: "/edit",
    component: EditPost,
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/Login"),
  },
  {
    name: "404",
    path: "/:pathMatch(.*)",
    component: PageError,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
});

export default router;
