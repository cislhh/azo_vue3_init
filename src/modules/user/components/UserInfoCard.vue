<script setup lang="ts">
import type { User } from '@/app/stores/types';

interface Props {
    user: User
}

defineProps<Props>();
</script>

<template>
    <div class="space-y-2">
        <p>用户名: {{ user.username }}</p>
        <p>邮箱: {{ user.email }}</p>
        <p>角色: {{ user.role }}</p>
    </div>
</template>
