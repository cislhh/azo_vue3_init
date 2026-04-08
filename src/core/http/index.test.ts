import type { InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePermissionStore } from '@/app/stores';
import { router } from '@/app/router';
import { notifyError, notifyWarning } from '@/shared/ui/notification';
import { createHttpInstance } from './index';

vi.mock('@/app/router', () => ({
    router: {
        push: vi.fn(),
    },
}));

vi.mock('@/shared/ui/notification', () => ({
    notifyError: vi.fn(),
    notifyWarning: vi.fn(),
}));

function createAdapter(data: Record<string, unknown>) {
    return vi.fn(async (config: InternalAxiosRequestConfig) => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
    }));
}

function createHttpErrorAdapter(status: number, data?: Record<string, unknown>) {
    return vi.fn(async (config: InternalAxiosRequestConfig) => {
        throw new AxiosError('Request failed', undefined, config, undefined, {
            data,
            status,
            statusText: 'ERROR',
            headers: {},
            config,
        });
    });
}

function createNetworkErrorAdapter() {
    return vi.fn(async (config: InternalAxiosRequestConfig) => {
        const error = new AxiosError('Network Error', undefined, config);
        error.request = {};
        throw error;
    });
}

describe('http 业务响应处理', () => {
    const removeItem = vi.fn();

    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        vi.useRealTimers();
        Object.defineProperty(globalThis, 'localStorage', {
            value: {
                getItem: vi.fn(),
                removeItem,
            },
            configurable: true,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('登录用户接口返回 authority_btns 时写入权限 store', async () => {
        const client = createHttpInstance({
            adapter: createAdapter({
                code: 0,
                data: { id: 1 },
                message: 'success',
                authority_btns: ['create', 'edit'],
            }),
        });

        const response = await client.get('/profile');

        expect(response.code).toBe(0);
        expect(usePermissionStore().authorityBtns).toEqual(['create', 'edit']);
    });

    it('301 和 302 登录失效时清 token 并跳转登录页', async () => {
        const codes = [301, 302];

        for (const code of codes) {
            const client = createHttpInstance({
                adapter: createAdapter({
                    code,
                    data: null,
                    msg: '登录已失效',
                }),
            });

            await expect(client.get('/profile')).rejects.toMatchObject({
                code,
                message: '登录已失效',
            });
        }

        expect(removeItem).toHaveBeenCalledWith('token');
        expect(router.push).toHaveBeenCalledWith('/login');
        expect(notifyError).toHaveBeenCalledWith('登录已失效');
    });

    it.each([
        { code: 202, path: '/usr/achives', message: '个人信息不完善' },
        { code: 203, path: '/org/organizations', message: '企业信息不完善' },
        { code: 205, path: '/usr/experts/list', message: '专家信息不完善' },
    ])('资料状态码 $code 会提示并在延时后跳转', async ({ code, path, message }) => {
        vi.useFakeTimers();
        const client = createHttpInstance({
            adapter: createAdapter({
                code,
                data: null,
                msg: message,
            }),
        });

        const request = client.get('/profile');
        const rejection = expect(request).rejects.toMatchObject({
            code,
            message,
        });

        await vi.advanceTimersByTimeAsync(2000);

        await rejection;
        expect(notifyWarning).toHaveBeenCalledWith(message);
        expect(router.push).toHaveBeenCalledWith(path);
    });

    it('http 404 错误会走统一错误提示', async () => {
        const client = createHttpInstance({
            adapter: createHttpErrorAdapter(404),
        });

        await expect(client.get('/missing')).rejects.toMatchObject({
            code: 404,
            message: '请求地址不存在',
        });
        expect(notifyError).toHaveBeenCalledWith('请求地址不存在');
    });

    it('http 错误存在后端 message 时优先提示后端信息', async () => {
        const client = createHttpInstance({
            adapter: createHttpErrorAdapter(500, { message: '服务开小差了' }),
        });

        await expect(client.get('/error')).rejects.toMatchObject({
            code: 500,
            message: '服务开小差了',
        });
        expect(notifyError).toHaveBeenCalledWith('服务开小差了');
    });

    it('网络异常会走统一错误提示', async () => {
        const client = createHttpInstance({
            adapter: createNetworkErrorAdapter(),
        });

        await expect(client.get('/timeout')).rejects.toMatchObject({
            message: '请求超时或网络错误',
        });
        expect(notifyError).toHaveBeenCalledWith('请求超时或网络错误');
    });

    it('skipErrorHandler 为 true 时不弹全局错误提示', async () => {
        const client = createHttpInstance({
            adapter: createHttpErrorAdapter(404),
        });

        await expect(client.get('/missing', { skipErrorHandler: true })).rejects.toMatchObject({
            code: 404,
            message: '请求地址不存在',
        });
        expect(notifyError).not.toHaveBeenCalled();
    });
});
