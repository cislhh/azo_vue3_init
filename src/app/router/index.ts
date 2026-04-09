import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, RouteMeta, RouteRecordRaw, RouterHistory } from 'vue-router';
import type { Pinia } from 'pinia';
import { routes as moduleRoutes } from 'vue-router/auto-routes';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { pinia, useUserStore } from '@/app/stores';

function mergeRouteMeta(meta?: RouteMeta): RouteMeta {
    return {
        requiresAuth: true,
        ...meta,
        layout: meta?.layout ?? DefaultLayout,
    };
}

const enhancedRoutes = moduleRoutes.map((route) => {
    return {
        ...route,
        meta: mergeRouteMeta(route.meta),
    } as RouteRecordRaw;
});

const staticRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('@/modules/auth/pages/Login.vue'),
        meta: { layout: null, requiresAuth: false },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/app/pages/NotFound.vue'),
        meta: { layout: null, requiresAuth: false },
    },
];

function createDefaultHistory() {
    return typeof window === 'undefined' ? createMemoryHistory() : createWebHistory();
}

function isPublicRoute(route: RouteLocationNormalized) {
    return route.matched.some((record) => record.meta.requiresAuth === false);
}

export function createAppRouter(options?: { history?: RouterHistory; pinia?: Pinia }) {
    const appRouter = createRouter({
        history: options?.history ?? createDefaultHistory(),
        routes: [...staticRoutes, ...enhancedRoutes],
    });

    appRouter.beforeEach((to) => {
        const userStore = useUserStore(options?.pinia ?? pinia);

        if (!userStore.initialized) {
            userStore.restoreSession();
        }

        if (!isPublicRoute(to) && !userStore.isLoggedIn) {
            return '/login';
        }

        if (to.path === '/login' && userStore.isLoggedIn) {
            return '/home';
        }

        return true;
    });

    return appRouter;
}

export const router = createAppRouter();
