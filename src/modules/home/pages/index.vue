<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-bold text-center mb-8 text-red-400 ">
          Tailwind CSS 测试页面
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <span class="text-white text-2xl">1</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">卡片样式</h3>
            <p class="text-gray-600">测试圆角、阴影和悬停效果</p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span class="text-white text-2xl">2</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">响应式布局</h3>
            <p class="text-gray-600">测试 Grid 和 Flexbox 布局</p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
              <span class="text-white text-2xl">3</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">渐变背景</h3>
            <p class="text-gray-600">测试背景渐变和色彩</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">组件测试</h2>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">按钮样式</label>
              <div class="flex flex-wrap gap-4">
                <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  主要按钮
                </button>
                <button class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  次要按钮
                </button>
                <button
                  class="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  边框按钮
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">输入框样式</label>
              <input type="text" placeholder="请输入内容..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">进度条</label>
              <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full" style="width: 75%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <p class="text-gray-600 mb-4">
            Tailwind CSS 已正确加载并生效！
          </p>
          <RouterLink to="/login"
            class="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
            前往登录页
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
