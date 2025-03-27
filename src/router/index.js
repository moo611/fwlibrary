// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import DashBoard from "../views/DashBoard.vue";
import User from "../views/user/index.vue";
import Book from "../views/book/index.vue";
import Borrow from "../views/borrow/index.vue";
import Seat from "../views/seat/index.vue";
import SeatRecord from "../views/record/index.vue";
import Store from "../views/store/index.vue";
import { getToken } from "../utils/auth"; // 访问缓存的用户名

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashBoard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "book",
        name: "Book",
        component: Book,
        meta: { requiresAuth: true },
      },
      {
        path: "user",
        name: "User",
        component: User,
        meta: { requiresAuth: true },
      },
      {
        path: "borrow",
        name: "Borrow",
        component: Borrow,
        meta: { requiresAuth: true },
      },
      {
        path: "seat",
        name: "Seat",
        component: Seat,
        meta: { requiresAuth: true },
      },
      {
        path: "record",
        name: "SeatRecord",
        component: SeatRecord,
        meta: { requiresAuth: true },
      },
      {
        path: "store",
        name: "Store",
        component: Store,
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: "/",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getToken(); // 根据缓存判断是否登录

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // 未登录重定向到登录页
  } else {
    next(); // 允许访问
  }
});

export default router;
