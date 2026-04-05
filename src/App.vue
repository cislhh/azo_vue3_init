<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();
// 动态 Layout 注入（若 meta.layout 为 null 则无布局）
const LayoutComponent = computed(() => route.meta.layout || 'div');
</script>

<template>
    <component :is="LayoutComponent">
        <RouterView />
    </component>
</template>
