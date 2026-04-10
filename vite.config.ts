import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import VueRouter from 'vue-router/vite';

const ONLYOFFICE_PROXY_PREFIX_RE = /^\/onlyoffice/;

/**
 * 扫描 modules 目录，自动生成路由文件夹配置
 * 支持 src/modules/xxx/pages/index.vue -> /xxx 路由
 */
function getRouteFolders() {
    const modulesDir = path.resolve(__dirname, 'src/modules');

    // 检查 modules 目录是否存在
    if (!fs.existsSync(modulesDir)) {
        return ['src/pages']; // 降级方案
    }

    const modules = fs.readdirSync(modulesDir, { withFileTypes: true });
    const routeFolders: Array<string | { src: string; path: string }> = [];

    for (const module of modules) {
        if (module.isDirectory()) {
            const modulePath = path.join(modulesDir, module.name);
            const pagesPath = path.join(modulePath, 'pages');

            if (fs.existsSync(pagesPath) && fs.statSync(pagesPath).isDirectory()) {
                routeFolders.push({
                    src: `src/modules/${module.name}/pages`,
                    path: `${module.name}/`,
                });
            }
        }
    }

    return routeFolders.length > 0 ? routeFolders : ['src/pages'];
}

export default defineConfig({
    plugins: [
        VueRouter({
            routesFolder: getRouteFolders(),
            dts: 'src/route-map.d.ts',
        }),
        vue(),
        tailwindcss(),
    ],
    server: {
        cors: true,
        host: '0.0.0.0',
        proxy: {
            // 代理 OnlyOffice 请求，避免 CORS 问题
            '/onlyoffice': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(ONLYOFFICE_PROXY_PREFIX_RE, ''),
            },
        },
    },
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') },
    },
});
