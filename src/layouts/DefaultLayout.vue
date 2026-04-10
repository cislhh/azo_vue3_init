<script lang="ts" setup>
import { useUserStore } from '@/app/stores';
import { RouterView, useRouter } from 'vue-router';
import LayoutSidebarMenu from './components/LayoutSidebarMenu.vue';
import { layoutMenuItems } from './config/layout-menu';

interface LogoutStore {
    logout: () => void;
}

interface LogoutRouter {
    push: (to: string) => Promise<unknown>;
}

async function handleLogoutAction(userStore: LogoutStore, router: LogoutRouter) {
    userStore.logout();
    await router.push('/login');
}

const userStore = useUserStore();
const router = useRouter();

async function handleLogout() {
    await handleLogoutAction(userStore, router);
}
</script>

<template>
    <div class="min-h-screen bg-gray-100">
        <header
            class="fixed top-0 right-0 left-0 z-50 flex h-[60px] items-center justify-between bg-[#1E50A2] px-6 shadow-md"
        >
            <div class="flex items-center gap-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <span class="text-sm font-bold text-[#1E50A2]">吉大</span>
                </div>
                <h1 class="text-lg font-semibold text-white">吉林大学科技开发办公室综合服务平台</h1>
            </div>

            <nav class="hidden items-center gap-8 md:flex">
                <button class="rounded-md bg-white/10 px-4 py-2 font-medium text-white"
                    >管理中心</button
                >
                <button
                    class="px-4 py-2 font-medium text-white/80 transition-colors hover:text-white"
                >
                    办事中心
                </button>
            </nav>

            <div class="flex items-center gap-4 text-white">
                <button class="relative text-white/80 hover:text-white" aria-label="消息提醒">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    <span
                        class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                    >
                        3
                    </span>
                </button>
                <div class="hidden items-center gap-2 md:flex">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <span class="text-sm font-medium">李</span>
                    </div>
                    <span class="text-sm">李佳</span>
                </div>
                <button
                    class="rounded-md border border-white/20 px-3 py-1 text-sm text-white/90 transition-colors hover:bg-white/10"
                    @click="handleLogout"
                >
                    退出
                </button>
            </div>
        </header>

        <div class="flex pt-[60px]">
            <aside
                class="fixed top-[60px] left-0 min-h-[calc(100vh-60px)] w-[220px] overflow-y-auto bg-white shadow-sm"
            >
                <div class="px-3 py-4">
                    <div class="mb-3 rounded-lg bg-[#1E50A2] px-4 py-3 text-white">
                        <span class="font-medium">管理中心</span>
                    </div>
                    <LayoutSidebarMenu :items="layoutMenuItems" />
                </div>
            </aside>

            <main class="ml-[220px] flex-1 p-6">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<style scoped>
aside::-webkit-scrollbar {
    width: 6px;
}

aside::-webkit-scrollbar-track {
    background: #f1f1f1;
}

aside::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
