import axios from 'axios';
import type {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

export interface ApiResponse<T = unknown> {
    code: number
    data: T
    message: string
}

export interface RequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean
    skipErrorHandler?: boolean
}

export interface HttpError extends Error {
    code?: number
    response?: unknown
}

function createHttpError(message: string, code?: number, response?: unknown): HttpError {
    const error = new Error(message) as HttpError;
    error.code = code;
    error.response = response;
    return error;
}

interface HttpClient extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch'> {
    get: <T = unknown>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>
    post: <T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig,
    ) => Promise<ApiResponse<T>>
    put: <T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig,
    ) => Promise<ApiResponse<T>>
    delete: <T = unknown>(url: string, config?: RequestConfig) => Promise<ApiResponse<T>>
    patch: <T = unknown>(
        url: string,
        data?: unknown,
        config?: RequestConfig,
    ) => Promise<ApiResponse<T>>
}

export function createHttpInstance(config?: AxiosRequestConfig): HttpClient {
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
        timeout: 10000,
        ...config,
    });

    axiosInstance.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig & RequestConfig) => {
            if (!requestConfig.skipAuth && typeof localStorage !== 'undefined') {
                const token = localStorage.getItem('token');
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
            const data = response.data;
            if (
                typeof data === 'object'
                && data !== null
                && 'code' in data
                && 'data' in data
                && 'message' in data
            ) {
                return data as ApiResponse;
            }
            return {
                code: response.status,
                data,
                message: 'success',
            } as ApiResponse;
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
                        message = '未授权，请重新登录';
                        if (typeof localStorage !== 'undefined') {
                            localStorage.removeItem('token');
                        }
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        break;
                    case 403:
                        message = '拒绝访问';
                        break;
                    case 404:
                        message = '请求地址不存在';
                        break;
                    case 500:
                        message = '服务器内部错误';
                        break;
                    default:
                        if (typeof data === 'object' && data !== null && 'message' in data) {
                            message = (data as { message: string }).message;
                        }
                }

                const httpError = createHttpError(message, status, data);
                console.error('[HTTP Error]', status, message, error.config?.url);
                return Promise.reject(httpError);
            }

            if (error.request) {
                console.error('[HTTP Error]', '请求超时或网络错误', error.config?.url);
                return Promise.reject(createHttpError('请求超时或网络错误'));
            }

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
                    onFulfilled?: (value: ApiResponse) => any,
                    onRejected?: (error: any) => any,
                ) => {
                    return axiosInstance.interceptors.response.use((response: AxiosResponse) => {
                        return onFulfilled?.(response as unknown as ApiResponse);
                    }, onRejected);
                },
                eject: (id: number) => axiosInstance.interceptors.response.eject(id),
            },
        },
    } as HttpClient;

    return instance;
}

export const http = createHttpInstance();
