import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory } from 'vue-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppRouter } from './index';
import type { UserSessionPayload } from '@/app/stores';

function createSessionPayload(): UserSessionPayload {
    return {
        token: 'session-token',
        user: {
            id: 1,
            name: '测试用户',
            account: 'tester',
            email: 'tester@example.com',
            avatar: 'https://example.com/avatar.png',
            role: 'admin',
        },
        permissions: [{ key: 'view-home', label: '首页', path: '/home' }],
    };
}

describe('app router 守卫', () => {
    const storage = {
        getItem: vi.fn<(key: string) => string | null>(),
        setItem: vi.fn<(key: string, value: string) => void>(),
        removeItem: vi.fn<(key: string) => void>(),
    };

    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        storage.getItem.mockReturnValue(null);
        Object.defineProperty(globalThis, 'localStorage', {
            value: storage,
            configurable: true,
        });
    });

    it('未登录访问 /home 会跳转到 /login', async () => {
        const pinia = createPinia();
        const router = createAppRouter({
            history: createMemoryHistory(),
            pinia,
        });

        await router.push('/home');
        await router.isReady();

        expect(router.currentRoute.value.fullPath).toBe('/login');
        expect(storage.getItem).toHaveBeenCalledWith('user-session');
    });

    it('已登录访问 /login 会跳转到 /home', async () => {
        const pinia = createPinia();
        storage.getItem.mockReturnValue(JSON.stringify(createSessionPayload()));
        const router = createAppRouter({
            history: createMemoryHistory(),
            pinia,
        });

        await router.push('/login');
        await router.isReady();

        expect(router.currentRoute.value.fullPath).toBe('/home');
        expect(storage.getItem).toHaveBeenCalledWith('user-session');
    });

    it('404 页面作为公开页可直接访问', async () => {
        const pinia = createPinia();
        const router = createAppRouter({
            history: createMemoryHistory(),
            pinia,
        });

        await router.push('/missing-page');
        await router.isReady();

        expect(router.currentRoute.value.matched.at(-1)?.meta.requiresAuth).toBe(false);
        expect(router.currentRoute.value.fullPath).toBe('/missing-page');
    });
});
