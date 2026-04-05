import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
// ✅ Vue Router 5: 自动导入模块路由（类型由 route-map.d.ts 提供）
import { routes as moduleRoutes } from "vue-router/auto-routes";

// ✅ 导入布局与页面（确保文件已创建）
import DefaultLayout from "@/layouts/DefaultLayout.vue";

// ✅ 类型安全地扩展模块路由：注入默认 Layout
const enhancedRoutes = moduleRoutes.map((route) => {
  // ✅ 只提取需要修改的 meta，其他属性保持原引用
  return {
    ...route,
    meta: {
      ...(route.meta || {}),
      layout: DefaultLayout,
    },
  } as RouteRecordRaw; // 🔑 单个路由断言
});

// ✅ 静态路由：不归属任何业务模块的页面（登录、404 等）
const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/modules/home/pages/index.vue"),
  },
  {
    path: "/login",
    component: () => import("@/modules/auth/pages/Login.vue"),
    meta: { layout: null }, // 登录页无需布局
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/app/pages/NotFound.vue"),
    meta: { layout: null },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  // ✅ 静态路由优先，确保 /login 和 404 能正确匹配
  routes: [...staticRoutes, ...enhancedRoutes],
});
