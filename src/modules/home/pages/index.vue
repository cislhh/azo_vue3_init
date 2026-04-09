<script lang="ts">
import { computed, defineComponent } from 'vue';
import { NButton } from 'naive-ui';
import { RouterLink, useRouter } from 'vue-router';
import { usePermissionStore, useUserStore } from '@/app/stores';

interface LogoutStore {
    logout: () => void;
}

interface LogoutRouter {
    push: (to: string) => Promise<unknown>;
}

export async function handleLogoutAction(userStore: LogoutStore, router: LogoutRouter) {
    userStore.logout();
    await router.push('/login');
}

export default defineComponent({
    name: 'HomePage',
    components: {
        NButton,
        RouterLink,
    },
    setup() {
        const permissionStore = usePermissionStore();
        const userStore = useUserStore();
        const router = useRouter();
        const entries = computed(() => permissionStore.authorityBtns);

        async function handleLogout() {
            await handleLogoutAction(userStore, router);
        }

        return {
            entries,
            handleLogout,
        };
    },
});
</script>

<template>
    <div class="min-h-screen bg-slate-100 px-6 py-10">
        <div class="mx-auto flex max-w-5xl flex-col gap-6">
            <section class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div class="space-y-2">
                        <p class="text-sm font-medium text-slate-500">工作台</p>
                        <h1 class="text-3xl font-semibold text-slate-900">首页</h1>
                        <p class="text-sm text-slate-600">根据当前账号权限展示可访问入口。</p>
                    </div>

                    <NButton
                        data-testid="logout-button"
                        tertiary
                        type="error"
                        @click="handleLogout"
                    >
                        退出登录
                    </NButton>
                </div>
            </section>

            <section class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div class="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-semibold text-slate-900">权限入口</h2>
                        <p class="mt-1 text-sm text-slate-500">仅显示当前账号已授权的页面。</p>
                    </div>
                    <span class="text-sm text-slate-400">{{ entries.length }} 个入口</span>
                </div>

                <div v-if="entries.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <RouterLink
                        v-for="entry in entries"
                        :key="entry.key"
                        :to="entry.path"
                        class="block rounded-2xl border border-slate-200 p-5 transition hover:border-blue-400 hover:shadow-sm"
                    >
                        <div class="space-y-2">
                            <h3 class="text-base font-medium text-slate-900">{{ entry.label }}</h3>
                            <p class="text-sm text-slate-500">{{ entry.path }}</p>
                            <NButton type="primary" secondary> 进入 {{ entry.label }} </NButton>
                        </div>
                    </RouterLink>
                </div>

                <div
                    v-else
                    class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500"
                >
                    暂无可访问入口
                </div>
            </section>

            <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 class="mb-4 text-lg font-semibold text-slate-900">当前路由信息</h2>
                <div class="space-y-2 text-sm text-slate-600">
                    <p>路径: {{ $route.path }}</p>
                    <p>名称: {{ $route.name }}</p>
                </div>
            </section>
        </div>
    </div>
</template>
