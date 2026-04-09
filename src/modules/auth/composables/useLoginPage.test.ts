import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUserStore } from '@/app/stores';
import type { UserSessionPayload } from '@/app/stores';
import { api } from '@/core/http/api';
import { useLoginPage } from './useLoginPage';

const { pushMock, replaceMock, loginMock } = vi.hoisted(() => ({
    pushMock: vi.fn<(to: string) => Promise<void>>(),
    replaceMock: vi.fn<(to: string) => Promise<void>>(),
    loginMock: vi.fn(),
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: replaceMock,
    }),
}));

vi.mock('@/core/http/api', () => ({
    api: {
        auth: {
            login: loginMock,
        },
    },
}));

function createSessionPayload(): UserSessionPayload {
    return {
        token: 'session-token',
        user: {
            id: 1,
            name: '测试用户',
            account: 'tester@example.com',
            email: 'tester@example.com',
            avatar: 'https://example.com/avatar.png',
            role: 'admin',
        },
        permissions: [{ key: 'view-home', label: '首页', path: '/home' }],
    };
}

describe('useLoginPage', () => {
    const mockedLogin = vi.mocked(api.auth.login);
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

    it('账号为空时阻止提交', async () => {
        const page = useLoginPage();

        page.form.password = '123456';

        await page.submit();

        expect(page.errorMessage.value).toBe('请输入账号');
        expect(mockedLogin).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('密码为空时阻止提交', async () => {
        const page = useLoginPage();

        page.form.account = 'tester';

        await page.submit();

        expect(page.errorMessage.value).toBe('请输入密码');
        expect(mockedLogin).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('邮箱格式错误时阻止提交', async () => {
        const page = useLoginPage();

        page.form.account = 'tester@invalid';
        page.form.password = '123456';

        await page.submit();

        expect(page.errorMessage.value).toBe('请输入正确的邮箱账号');
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    it('登录成功后写入会话并跳转到 /home', async () => {
        const page = useLoginPage();
        const payload = createSessionPayload();
        const userStore = useUserStore();
        const loginSuccessSpy = vi.spyOn(userStore, 'loginSuccess');
        mockedLogin.mockResolvedValue(payload);

        page.form.account = 'tester@example.com';
        page.form.password = '123456';

        await page.submit();

        expect(mockedLogin).toHaveBeenCalledWith({
            account: 'tester@example.com',
            password: '123456',
        });
        expect(loginSuccessSpy).toHaveBeenCalledWith(payload);
        expect(storage.setItem).toHaveBeenCalledWith('user-session', JSON.stringify(payload));
        expect(pushMock).toHaveBeenCalledWith('/home');
        expect(page.errorMessage.value).toBe('');
        expect(page.submitting.value).toBe(false);
    });

    it('登录失败时显示错误信息', async () => {
        const page = useLoginPage();
        mockedLogin.mockRejectedValue(new Error('账号或密码错误'));

        page.form.account = 'tester';
        page.form.password = 'wrong-password';

        await page.submit();

        expect(page.errorMessage.value).toBe('账号或密码错误');
        expect(pushMock).not.toHaveBeenCalled();
        expect(page.submitting.value).toBe(false);
    });

    it('提交中再次提交不会重复调用接口', async () => {
        let resolveLogin!: (value: UserSessionPayload) => void;
        const page = useLoginPage();
        mockedLogin.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveLogin = resolve;
                }),
        );

        page.form.account = 'tester@example.com';
        page.form.password = '123456';

        const firstSubmit = page.submit();
        const secondSubmit = page.submit();

        expect(mockedLogin).toHaveBeenCalledTimes(1);

        resolveLogin(createSessionPayload());
        await firstSubmit;
        await secondSubmit;
    });

    it('返回结构非法时显示错误且不会写入会话或跳转', async () => {
        const page = useLoginPage();
        const userStore = useUserStore();
        const loginSuccessSpy = vi.spyOn(userStore, 'loginSuccess');
        mockedLogin.mockResolvedValue({
            token: 'broken-token',
            user: {
                id: 1,
                name: '测试用户',
            },
            permissions: [],
        } as unknown as UserSessionPayload);

        page.form.account = 'tester@example.com';
        page.form.password = '123456';

        await page.submit();

        expect(page.errorMessage.value).toBe('登录返回数据格式错误');
        expect(loginSuccessSpy).not.toHaveBeenCalled();
        expect(storage.setItem).not.toHaveBeenCalled();
        expect(pushMock).not.toHaveBeenCalled();
        expect(page.submitting.value).toBe(false);
    });
});
