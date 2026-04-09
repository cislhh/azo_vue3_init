import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePermissionStore } from './permission';
import { useUserStore } from './user';
import type { UserSessionPayload } from './types';

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
        permissions: [
            { key: 'create', label: '创建', path: '/content/create' },
            { key: 'edit', label: '编辑', path: '/content/edit' },
        ],
    };
}

describe('user 会话 store', () => {
    const SESSION_KEY = 'user-session';
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

    it('登录成功后会写入会话并同步权限按钮', () => {
        const userStore = useUserStore();
        const permissionStore = usePermissionStore();
        const payload = createSessionPayload();

        userStore.loginSuccess(payload);

        expect(userStore.token).toBe(payload.token);
        expect(userStore.currentUser).toEqual(payload.user);
        expect(userStore.permissions).toEqual(payload.permissions);
        expect(userStore.initialized).toBe(true);
        expect(userStore.isLoggedIn).toBe(true);
        expect(permissionStore.authorityBtns).toEqual(payload.permissions);
        expect(storage.setItem).toHaveBeenCalledWith(SESSION_KEY, JSON.stringify(payload));
    });

    it('恢复有效会话时会回填 store 状态', () => {
        const payload = createSessionPayload();
        storage.getItem.mockImplementation((key: string) => {
            if (key === SESSION_KEY) {
                return JSON.stringify(payload);
            }

            return null;
        });

        const userStore = useUserStore();
        const permissionStore = usePermissionStore();

        userStore.restoreSession();

        expect(userStore.token).toBe(payload.token);
        expect(userStore.currentUser).toEqual(payload.user);
        expect(userStore.permissions).toEqual(payload.permissions);
        expect(userStore.initialized).toBe(true);
        expect(userStore.isLoggedIn).toBe(true);
        expect(permissionStore.authorityBtns).toEqual(payload.permissions);
    });

    it('恢复结构非法但 JSON 合法的会话时会清理状态', () => {
        storage.getItem.mockReturnValue(
            JSON.stringify({
                token: 'session-token',
                user: {
                    id: 1,
                    name: '测试用户',
                    email: 'tester@example.com',
                },
                permissions: [{ key: 'create', label: '创建' }],
            }),
        );

        const userStore = useUserStore();
        const permissionStore = usePermissionStore();

        userStore.restoreSession();

        expect(userStore.token).toBeNull();
        expect(userStore.currentUser).toBeNull();
        expect(userStore.permissions).toEqual([]);
        expect(userStore.initialized).toBe(true);
        expect(userStore.isLoggedIn).toBe(false);
        expect(permissionStore.authorityBtns).toEqual([]);
        expect(storage.removeItem).toHaveBeenCalledWith(SESSION_KEY);
    });

    it('恢复非法会话和退出登录都会清理持久化数据', () => {
        storage.getItem.mockReturnValue('invalid-json');

        const userStore = useUserStore();
        const permissionStore = usePermissionStore();

        userStore.restoreSession();

        expect(userStore.token).toBeNull();
        expect(userStore.currentUser).toBeNull();
        expect(userStore.permissions).toEqual([]);
        expect(userStore.initialized).toBe(true);
        expect(userStore.isLoggedIn).toBe(false);
        expect(permissionStore.authorityBtns).toEqual([]);
        expect(storage.removeItem).toHaveBeenCalledWith(SESSION_KEY);

        storage.removeItem.mockClear();
        storage.setItem.mockClear();

        userStore.loginSuccess(createSessionPayload());
        userStore.logout();

        expect(userStore.token).toBeNull();
        expect(userStore.currentUser).toBeNull();
        expect(userStore.permissions).toEqual([]);
        expect(userStore.initialized).toBe(true);
        expect(userStore.isLoggedIn).toBe(false);
        expect(permissionStore.authorityBtns).toEqual([]);
        expect(storage.removeItem).toHaveBeenCalledWith(SESSION_KEY);
    });
});
