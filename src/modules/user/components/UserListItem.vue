<script setup lang="ts">
import type { User } from '@/app/stores/types';

interface Props {
    user: User
    showLogin?: boolean
}

interface Emits {
    login: [username: string]
}

const props = withDefaults(defineProps<Props>(), {
    showLogin: false,
});
const emit = defineEmits<Emits>();
</script>

<template>
    <div class="flex items-center justify-between rounded border p-3">
        <div>
            <p class="font-medium">{{ user.username }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
        </div>
        <div class="flex items-center gap-2">
            <span
                class="rounded px-2 py-1 text-xs"
                :class="{
                    'bg-green-100 text-green-700': user.role === 'admin',
                    'bg-gray-100 text-gray-700': user.role === 'user',
                }"
            >
                {{ user.role }}
            </span>
            <button
                v-if="showLogin"
                class="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                @click="emit('login', user.username)"
            >
                登录
            </button>
        </div>
    </div>
</template>
