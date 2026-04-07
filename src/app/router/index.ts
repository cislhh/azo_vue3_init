import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { routes as moduleRoutes } from 'vue-router/auto-routes';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const enhancedRoutes = moduleRoutes.map((route) => {
    return {
        ...route,
        meta: {
            ...(route.meta || {}),
            layout: DefaultLayout,
        },
    } as RouteRecordRaw;
});

const staticRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('@/modules/auth/pages/Login.vue'),
        meta: { layout: null },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/app/pages/NotFound.vue'),
        meta: { layout: null },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes: [...staticRoutes, ...enhancedRoutes],
});
