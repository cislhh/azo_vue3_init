import type { UserSessionPayload } from '@/app/stores';

interface MockLoginPayload {
    account: string;
    password: string;
}

function createDelay() {
    return 300 + Math.floor(Math.random() * 201);
}

function wait() {
    return new Promise((resolve) => {
        globalThis.setTimeout(resolve, createDelay());
    });
}

export async function mockLogin(payload: MockLoginPayload): Promise<UserSessionPayload> {
    await wait();

    if (typeof payload.account !== 'string' || !payload.account.trim()) {
        throw new Error('账号不能为空');
    }

    if (payload.password !== '123456') {
        throw new Error('账号或密码错误');
    }

    return {
        token: 'mock-token-admin',
        user: {
            id: 'mock-admin',
            name: '系统管理员',
            account: payload.account.trim(),
            email: 'admin@example.com',
            role: 'admin',
        },
        permissions: [
            {
                key: 'home:view',
                label: '首页',
                path: '/home',
            },
            {
                key: 'dashboard:view',
                label: '仪表盘',
                path: '/dashboard',
            },
        ],
    };
}
