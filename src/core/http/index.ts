import { router } from '@/app/router';
import type { AuthorityButton } from '@/app/stores';
import { getPersistedSessionToken, pinia, usePermissionStore, useUserStore } from '@/app/stores';
import { notifyError, notifyWarning } from '@/shared/ui/notification';
import type {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

export interface ApiResponse<T = unknown> {
    code: number;
    data: T;
    message: string;
    authority_btns?: AuthorityButton[];
}

export interface RequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean;
    skipErrorHandler?: boolean;
}

export interface HttpError extends Error {
    code?: number;
    response?: unknown;
}

interface RawApiResponse<T = unknown> {
    code: number;
    data: T;
    message?: string;
    msg?: string;
    authority_btns?: AuthorityButton[];
}

const BUSINESS_ROUTE_MAP: Record<number, string> = {
    202: '/usr/achives',
    203: '/org/organizations',
    205: '/usr/experts/list',
};

function isRawApiResponse(data: unknown): data is RawApiResponse {
    return typeof data === 'object' && data !== null && 'code' in data && 'data' in data;
}

function getResponseMessage(data: Partial<RawApiResponse> | undefined, fallback: string) {
    if (!data) {
        return fallback;
    }

    if (typeof data.message === 'string' && data.message.trim()) {
        return data.message;
    }

    if (typeof data.msg === 'string' && data.msg.trim()) {
        return data.msg;
    }

    return fallback;
}

function syncAuthorityButtons(buttons?: AuthorityButton[]) {
    if (!Array.isArray(buttons)) {
        return;
    }

    usePermissionStore(pinia).setAuthorityBtns(buttons);
}

function shouldHandleError(config?: RequestConfig) {
    return !config?.skipErrorHandler;
}

function notifyHttpError(message: string, config?: RequestConfig) {
    if (!shouldHandleError(config)) {
        return;
    }

    notifyError(message);
}

function clearAuthSession() {
    useUserStore(pinia).logout();
}

function handleBusinessCode(response: ApiResponse) {
    const message = response.message;

    if (response.code === 301 || response.code === 302) {
        clearAuthSession();
        notifyError(message);
        void router.push('/login');
        return createHttpError(message, response.code, response);
    }

    if (response.code in BUSINESS_ROUTE_MAP) {
        notifyWarning(message);
        const targetPath = BUSINESS_ROUTE_MAP[response.code];
        globalThis.setTimeout(() => {
            void router.push(targetPath);
        }, 2000);
        return createHttpError(message, response.code, response);
    }

    return null;
}

function normalizeResponse<T = unknown>(response: AxiosResponse<T>): ApiResponse<T> {
    const data = response.data;

    if (isRawApiResponse(data)) {
        return {
            code: data.code,
            data: data.data as T,
            message: getResponseMessage(data, 'success'),
            authority_btns: data.authority_btns,
        };
    }

    return {
        code: response.status,
        data,
        message: 'success',
    } as ApiResponse<T>;
}

function createHttpError(message: string, code?: number, response?: unknown): HttpError {
    const error = new Error(message) as HttpError;
    error.code = code;
    error.response = response;
    return error;
}

interface HttpClient extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> {
    get: <T = unknown>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>;
    post: <T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig,
    ) => Promise<ApiResponse<T>>;
    put: <T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig,
    ) => Promise<ApiResponse<T>>;
    delete: <T = unknown>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>;
    patch: <T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig,
    ) => Promise<ApiResponse<T>>;
}

export function createHttpInstance(config?: AxiosRequestConfig): HttpClient {
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
        timeout: 10000,
        ...config,
    });

    axiosInstance.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig & RequestConfig) => {
            if (!requestConfig.skipAuth) {
                const token = getPersistedSessionToken();
                if (token) {
                    requestConfig.headers.Authorization = `Bearer ${token}`;
                }
            }
            return requestConfig;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        // @ts-expect-error - 我们故意返回 ApiResponse 而不是 AxiosResponse
        (response: AxiosResponse) => {
            const normalizedResponse = normalizeResponse(response);
            syncAuthorityButtons(normalizedResponse.authority_btns);

            const businessError = handleBusinessCode(normalizedResponse);
            if (businessError) {
                return Promise.reject(businessError);
            }

            return normalizedResponse;
        },
        (error: AxiosError) => {
            if (axios.isCancel(error)) {
                return Promise.reject(createHttpError('请求已取消'));
            }

            if (error.response) {
                const { status, data } = error.response;
                let message = '请求失败';

                switch (status) {
                    case 401:
                        message = getResponseMessage(
                            data as Partial<RawApiResponse>,
                            '未授权，请重新登录',
                        );
                        clearAuthSession();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        break;
                    case 403:
                        message = getResponseMessage(data as Partial<RawApiResponse>, '拒绝访问');
                        break;
                    case 404:
                        message = getResponseMessage(
                            data as Partial<RawApiResponse>,
                            '请求地址不存在',
                        );
                        break;
                    case 500:
                        message = getResponseMessage(
                            data as Partial<RawApiResponse>,
                            '服务器内部错误',
                        );
                        break;
                    default:
                        message = getResponseMessage(data as Partial<RawApiResponse>, message);
                }

                const httpError = createHttpError(message, status, data);
                notifyHttpError(message, error.config as RequestConfig | undefined);
                console.error('[HTTP Error]', status, message, error.config?.url);
                return Promise.reject(httpError);
            }

            if (error.request) {
                notifyHttpError('请求超时或网络错误', error.config as RequestConfig | undefined);
                console.error('[HTTP Error]', '请求超时或网络错误', error.config?.url);
                return Promise.reject(createHttpError('请求超时或网络错误'));
            }

            notifyHttpError(error.message, error.config as RequestConfig | undefined);
            console.error('[HTTP Error]', error.message);
            return Promise.reject(createHttpError(error.message));
        },
    );

    const instance = {
        ...axiosInstance,
        get: async <T = unknown>(url: string, config?: RequestConfig) => {
            const response = await axiosInstance.get(url, config);
            return response as unknown as ApiResponse<T>;
        },
        post: async <T = unknown>(url: string, data?: unknown, config?: RequestConfig) => {
            const response = await axiosInstance.post(url, data, config);
            return response as unknown as ApiResponse<T>;
        },
        put: async <T = unknown>(url: string, data?: unknown, config?: RequestConfig) => {
            const response = await axiosInstance.put(url, data, config);
            return response as unknown as ApiResponse<T>;
        },
        delete: async <T = unknown>(url: string, config?: RequestConfig) => {
            const response = await axiosInstance.delete(url, config);
            return response as unknown as ApiResponse<T>;
        },
        patch: async <T = unknown>(url: string, data?: unknown, config?: RequestConfig) => {
            const response = await axiosInstance.patch(url, data, config);
            return response as unknown as ApiResponse<T>;
        },
        interceptors: {
            request: axiosInstance.interceptors.request,
            response: {
                use: (
                    onFulfilled?: (value: ApiResponse) => unknown,
                    onRejected?: (error: unknown) => unknown,
                ) => {
                    return axiosInstance.interceptors.response.use((response: AxiosResponse) => {
                        onFulfilled?.(response as unknown as ApiResponse);
                        return response;
                    }, onRejected);
                },
                eject: (id: number) => axiosInstance.interceptors.response.eject(id),
            },
        },
    } as HttpClient;

    return instance;
}

export const http = createHttpInstance();
