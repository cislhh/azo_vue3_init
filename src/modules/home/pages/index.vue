<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="min-h-screen from-blue-50 to-indigo-100">
        <div class="container mx-auto px-4 py-16">
            <div class="mx-auto max-w-4xl">
                <h1 class="position-relative mb-8 text-center text-5xl font-bold text-red-400">
                    Tailwind CSS 测试页面
                </h1>

                <div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div
                        class="rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                    >
                        <div
                            class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500"
                        >
                            <span class="text-2xl text-white">1</span>
                        </div>
                        <h3 class="mb-2 text-xl font-semibold text-gray-800">卡片样式</h3>
                        <p class="text-gray-600">测试圆角、阴影和悬停效果</p>
                    </div>

                    <div
                        class="rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                    >
                        <div
                            class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500"
                        >
                            <span class="text-2xl text-white">2</span>
                        </div>
                        <h3 class="mb-2 text-xl font-semibold text-gray-800">响应式布局</h3>
                        <p class="text-gray-600">测试 Grid 和 Flexbox 布局</p>
                    </div>

                    <div
                        class="rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                    >
                        <div
                            class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500"
                        >
                            <span class="text-2xl text-white">3</span>
                        </div>
                        <h3 class="mb-2 text-xl font-semibold text-gray-800">渐变背景</h3>
                        <p class="text-gray-600">测试背景渐变和色彩</p>
                    </div>
                </div>

                <div class="mb-12 rounded-lg bg-white p-8 shadow-lg">
                    <h2 class="mb-6 text-3xl font-bold text-gray-800">组件测试</h2>

                    <div class="space-y-6">
                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700"
                                >按钮样式</label
                            >
                            <div class="flex flex-wrap gap-4">
                                <button
                                    class="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                                >
                                    主要按钮
                                </button>
                                <button
                                    class="rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition-colors hover:bg-gray-300"
                                >
                                    次要按钮
                                </button>
                                <button
                                    class="rounded-lg border-2 border-blue-600 px-6 py-2 text-blue-600 transition-colors hover:bg-blue-50"
                                >
                                    边框按钮
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700"
                                >输入框样式</label
                            >
                            <input
                                type="text"
                                placeholder="请输入内容..."
                                class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label class="mb-2 block text-sm font-medium text-gray-700"
                                >进度条</label
                            >
                            <div class="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                    class="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                    style="width: 75%"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <p class="mb-4 text-gray-600">Tailwind CSS 已正确加载并生效！</p>
                    <RouterLink
                        to="/login"
                        class="inline-block rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700 hover:shadow-xl"
                    >
                        前往登录页
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
