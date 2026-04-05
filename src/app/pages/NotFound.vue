<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center text-center"
  >
    <h1 class="text-6xl font-bold text-gray-800">404</h1>
    <p class="mt-4 text-lg text-gray-600">页面不存在</p>
    <RouterLink to="/" class="mt-6 text-blue-600 hover:underline"
      >返回首页</RouterLink
    >
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
