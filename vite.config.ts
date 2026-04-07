import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import VueRouter from 'vue-router/vite';

export default defineConfig({
    plugins: [
        VueRouter({
            routesFolder: 'src/modules/*/pages',
            dts: 'src/route-map.d.ts',
        }),
        vue(),
        tailwindcss(),
    ],
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') },
    },
});
