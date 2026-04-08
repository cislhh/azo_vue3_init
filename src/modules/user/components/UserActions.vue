<script setup lang="ts">
interface Props {
    loading: boolean
    hasCurrentUser: boolean
}

interface Emits {
    fetch: []
    logout: []
    addUser: []
    reset: []
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
    <div class="space-y-4">
        <div class="mb-4">
            <button
                class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                :disabled="loading"
                @click="emit('fetch')"
            >
                {{ loading ? '加载中...' : '获取用户列表' }}
            </button>
            <button
                v-if="hasCurrentUser"
                class="ml-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                @click="emit('logout')"
            >
                退出登录
            </button>
        </div>

        <div class="mt-4">
            <button
                class="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
                @click="emit('addUser')"
            >
                添加测试用户
            </button>
            <button
                class="ml-2 rounded bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600"
                @click="emit('reset')"
            >
                重置状态
            </button>
        </div>
    </div>
</template>
