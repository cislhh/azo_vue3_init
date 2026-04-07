import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import VueRouter from 'vue-router/vite';
import fs from 'fs';
import fg from 'fast-glob';

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

    // 获取所有包含 pages 目录的模块
    const pagesDirs = fg.sync('*/pages', {
        cwd: modulesDir,
        onlyDirectories: true,
        absolute: false,
    });

    if (pagesDirs.length === 0) {
        return ['src/pages']; // 降级方案
    }

    // 为每个模块生成路由配置
    const routeFolders = pagesDirs.map((pagesDir: string) => {
        const moduleName = pagesDir.split('/')[0]; // 获取模块名
        return {
            src: `src/modules/${pagesDir}`,
            path: `${moduleName}/`, // 路由前缀
        };
    });

    return routeFolders;
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
