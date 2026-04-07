import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import VueRouter from 'vue-router/vite';
import fs from 'fs';

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
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') },
    },
});
