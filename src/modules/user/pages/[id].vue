<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = route.params.id;
</script>

<template>
    <div class="flex min-h-screen items-center justify-center">
        <div class="text-center">
            <h1 class="mb-4 text-4xl font-bold">用户详情</h1>
            <p class="text-gray-600">用户 ID: {{ userId }}</p>
        </div>
    </div>
</template>
