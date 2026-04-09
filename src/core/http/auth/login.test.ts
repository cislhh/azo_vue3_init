import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const postMock = vi.fn();

vi.mock('../index', () => ({
    http: {
        post: postMock,
    },
}));

import { login } from './login';

describe('auth login', () => {
    beforeEach(() => {
        postMock.mockReset();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('开启 mock 开关时返回最小登录数据', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'true');

        const result = await login({
            account: 'admin',
            password: '123456',
        });

        expect(result.token).toBeTypeOf('string');
        expect(result.user).toMatchObject({
            account: 'admin',
        });
        expect(result.permissions).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    key: expect.any(String),
                    label: expect.any(String),
                    path: expect.any(String),
                }),
            ]),
        );
    });

    it('密码错误时返回失败信息', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'true');

        await expect(
            login({
                account: 'admin',
                password: 'wrong-password',
            }),
        ).rejects.toMatchObject({
            message: '账号或密码错误',
        });
    });

    it('账号为空白时返回失败信息', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'true');

        await expect(
            login({
                account: '   ',
                password: '123456',
            }),
        ).rejects.toMatchObject({
            message: '账号不能为空',
        });
    });

    it('关闭 mock 开关时会把真实登录响应映射成会话结构', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'false');
        postMock.mockResolvedValue({
            data: {
                token: 'real-token',
                user: {
                    id: '1',
                    name: '真实用户',
                    account: 'admin',
                    email: 'admin@example.com',
                },
                permissions: [{ key: 'dashboard:view', label: '仪表盘', path: '/dashboard' }],
            },
        });

        const payload = {
            account: 'admin',
            password: '123456',
        };
        const result = await login(payload);

        expect(postMock).toHaveBeenCalledWith('/auth/login', payload, {
            skipAuth: true,
        });
        expect(result).toEqual({
            token: 'real-token',
            user: {
                id: '1',
                name: '真实用户',
                account: 'admin',
                email: 'admin@example.com',
            },
            permissions: [{ key: 'dashboard:view', label: '仪表盘', path: '/dashboard' }],
        });
    });

    it('真实登录响应存在 authority_btns 时会映射为 permissions', async () => {
        vi.stubEnv('VITE_USE_MOCK', 'false');
        postMock.mockResolvedValue({
            data: {
                token: 'real-token',
                user: {
                    id: '1',
                    name: '真实用户',
                    account: 'admin',
                    email: 'admin@example.com',
                },
            },
            authority_btns: [{ key: 'home:view', label: '首页', path: '/home' }],
        });

        const result = await login({
            account: 'admin',
            password: '123456',
        });

        expect(result).toEqual({
            token: 'real-token',
            user: {
                id: '1',
                name: '真实用户',
                account: 'admin',
                email: 'admin@example.com',
            },
            permissions: [{ key: 'home:view', label: '首页', path: '/home' }],
        });
    });
});
