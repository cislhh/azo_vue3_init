import type { PermissionEntry, User, UserSessionPayload } from '@/app/stores';
import type { ApiResponse } from '../index';
import { mockLogin } from '../mock';

export interface LoginPayload {
    account: string;
    password: string;
}

type LoginResult = UserSessionPayload;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function mapUser(value: unknown): User | null {
    if (!isRecord(value)) {
        return null;
    }

    if (
        (typeof value.id !== 'number' && typeof value.id !== 'string') ||
        typeof value.name !== 'string'
    ) {
        return null;
    }

    if (typeof value.account !== 'string' || typeof value.email !== 'string') {
        return null;
    }

    return {
        id: value.id,
        name: value.name,
        account: value.account,
        email: value.email,
        avatar: typeof value.avatar === 'string' ? value.avatar : undefined,
        role: typeof value.role === 'string' ? value.role : undefined,
    };
}

function mapPermissions(value: unknown): PermissionEntry[] | null {
    if (!Array.isArray(value)) {
        return null;
    }

    const permissions = value.map((item) => {
        if (!isRecord(item)) {
            return null;
        }

        if (
            typeof item.key !== 'string' ||
            typeof item.label !== 'string' ||
            typeof item.path !== 'string'
        ) {
            return null;
        }

        return {
            key: item.key,
            label: item.label,
            path: item.path,
        };
    });

    return permissions.every(Boolean) ? (permissions as PermissionEntry[]) : null;
}

function mapLoginResponse(response: ApiResponse<Record<string, unknown>>): UserSessionPayload {
    const payload = response.data;
    const permissions = mapPermissions(payload.permissions ?? response.authority_btns);
    const user = mapUser(payload.user);

    if (typeof payload.token !== 'string' || !user || !permissions) {
        throw new Error('登录返回数据格式错误');
    }

    return {
        token: payload.token,
        user,
        permissions,
    };
}

function requestRealLogin(payload: LoginPayload): Promise<LoginResult> {
    return import('../index').then(({ http }) => {
        return http
            .post<Record<string, unknown>>('/auth/login', payload, {
                skipAuth: true,
            })
            .then((response) => mapLoginResponse(response));
    });
}

export function login(payload: LoginPayload): Promise<LoginResult> {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
        // MOCK: 本地联调用，接真实接口后删除此分支
        return mockLogin(payload);
    }

    // REAL: 后端接口接入后保留此分支
    return requestRealLogin(payload);
}
