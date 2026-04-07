<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { NButton } from 'naive-ui';
</script>

<template>
    <div class="min-h-screen from-blue-50 to-indigo-100 p-8">
        <div class="mx-auto max-w-4xl">
            <h1 class="mb-8 text-4xl font-bold">首页</h1>

            <div class="space-y-4">
                <h2 class="text-2xl font-semibold">路由测试</h2>

                <div class="flex flex-wrap gap-4">
                    <RouterLink to="/home">
                        <NButton type="primary">首页</NButton>
                    </RouterLink>

                    <RouterLink to="/dashboard">
                        <NButton type="info">仪表盘</NButton>
                    </RouterLink>

                    <RouterLink to="/user">
                        <NButton type="success">用户首页</NButton>
                    </RouterLink>

                    <RouterLink to="/user/list">
                        <NButton type="warning">用户列表</NButton>
                    </RouterLink>

                    <RouterLink to="/user/123">
                        <NButton type="error">用户详情 (ID: 123)</NButton>
                    </RouterLink>

                    <RouterLink to="/login">
                        <NButton type="default">登录</NButton>
                    </RouterLink>
                </div>

                <div class="mt-8 rounded-lg bg-white p-6 shadow">
                    <h3 class="mb-4 text-xl font-semibold">当前路由信息</h3>
                    <p>路径: {{ $route.path }}</p>
                    <p>名称: {{ $route.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
