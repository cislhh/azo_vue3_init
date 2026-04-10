import { createPinia, setActivePinia } from 'pinia';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from './index.vue';

let activePinia = createPinia();

async function renderHomePage() {
    const app = createSSRApp(HomePage);
    app.use(activePinia);
    app.config.globalProperties.$route = { path: '/home', name: '/home/' } as never;

    return renderToString(app);
}

describe('home page', () => {
    beforeEach(() => {
        activePinia = createPinia();
        setActivePinia(activePinia);
    });

    it('渲染办公协同首页的静态结构', async () => {
        const html = await renderHomePage();

        expect(html).toContain('数据概览');
        expect(html).toContain('横向项目立项数');
        expect(html).toContain('累计到款数(万元)');
        expect(html).toContain('待办事项');
        expect(html).toContain('已办事项');
        expect(html).toContain('公告');
    });

    it('不再渲染旧版权限入口模块', async () => {
        const html = await renderHomePage();

        expect(html).not.toContain('权限入口');
        expect(html).not.toContain('暂无可访问入口');
        expect(html).not.toContain('当前路由信息');
    });

    it('渲染横向项目入口并指向业务路由', async () => {
        const html = await renderHomePage();

        expect(html).toContain('横向项目');
        expect(html).toContain('/project-demand');
    });
});
