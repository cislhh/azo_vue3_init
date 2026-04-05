import axios from 'axios';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
});

// 请求拦截：自动注入 Token
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// 响应拦截：统一错误处理
http.interceptors.response.use(
    (res) => res.data,
    (err) => {
        console.error('[HTTP Error]', err.response?.status, err.message);
        return Promise.reject(err);
    },
);
