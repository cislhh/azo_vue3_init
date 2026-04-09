import { createPinia, setActivePinia } from 'pinia';
import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePermissionStore, useUserStore } from '@/app/stores';
import HomePage from './index.vue';

const pushMock = vi.fn<(to: string) => Promise<void>>();
let activePinia = createPinia();

vi.mock('vue-router', async () => {
    const actual = await vi.importActual<typeof import('vue-router')>('vue-router');

    return {
        ...actual,
        RouterLink: defineComponent({
            name: 'RouterLink',
            props: {
                to: {
                    type: [String, Object],
                    required: true,
                },
            },
            setup(props, { slots }) {
                return () => h('a', { 'data-to': props.to }, slots.default?.());
            },
        }),
        useRouter: () => ({
            push: pushMock,
        }),
    };
});

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
        pushMock.mockReset();
    });

    it('存在权限入口时渲染对应按钮文案', async () => {
        const permissionStore = usePermissionStore();
        permissionStore.setAuthorityBtns([
            { key: 'home', label: '首页', path: '/home' },
            { key: 'dashboard', label: '仪表盘', path: '/dashboard' },
        ]);

        const html = await renderHomePage();

        expect(html).toContain('首页');
        expect(html).toContain('仪表盘');
        expect(html).not.toContain('暂无可访问入口');
    });

    it('权限入口为空时显示空态', async () => {
        const html = await renderHomePage();

        expect(html).toContain('暂无可访问入口');
    });

    it('退出登录时调用 logout 并跳转到登录页', async () => {
        const userStore = useUserStore();
        const logoutSpy = vi.spyOn(userStore, 'logout');
        const homeModule = (await import('./index.vue')) as unknown as {
            handleLogoutAction: (store: typeof userStore, appRouter: { push: typeof pushMock }) => Promise<void>;
        };

        await homeModule.handleLogoutAction(userStore, { push: pushMock });

        expect(logoutSpy).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith('/login');
    });
});
