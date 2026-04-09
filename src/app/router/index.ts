import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import type { Pinia } from 'pinia';
import type { RouteLocationNormalized, RouteMeta, RouteRecordRaw, RouterHistory } from 'vue-router';
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

function createStaticRoutes(piniaInstance: Pinia): RouteRecordRaw[] {
    return [
        {
            path: '/',
            redirect: () => {
                return useUserStore(piniaInstance).isLoggedIn ? '/home' : '/login';
            },
            meta: { layout: null, requiresAuth: false },
        },
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
}

function createDefaultHistory() {
    return typeof window === 'undefined' ? createMemoryHistory() : createWebHistory();
}

function isPublicRoute(route: RouteLocationNormalized) {
    return route.matched.some((record) => record.meta.requiresAuth === false);
}

export function createAppRouter(options?: { history?: RouterHistory; pinia?: Pinia }) {
    const piniaInstance = options?.pinia ?? pinia;
    const appRouter = createRouter({
        history: options?.history ?? createDefaultHistory(),
        routes: [...createStaticRoutes(piniaInstance), ...enhancedRoutes],
    });

    appRouter.beforeEach((to) => {
        const userStore = useUserStore(piniaInstance);

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
