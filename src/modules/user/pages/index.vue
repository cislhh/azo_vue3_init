<script setup lang="ts">
import { useUserPage } from '../composables/useUserPage';
import ErrorAlert from '../components/ErrorAlert.vue';
import UserInfoCard from '../components/UserInfoCard.vue';
import UserListItem from '../components/UserListItem.vue';
import UserActions from '../components/UserActions.vue';

const {
    currentUser,
    users,
    loading,
    error,
    isLoggedIn,
    userCount,
    handleFetchUsers,
    handleLogin,
    handleLogout,
    handleAddUser,
    handleReset,
} = useUserPage();
</script>

<template>
    <div class="p-4">
        <h1 class="mb-4 text-xl font-bold">用户模块</h1>

        <ErrorAlert v-if="error" :message="error" />

        <div class="mb-4 rounded bg-gray-100 p-4">
            <h2 class="mb-2 font-semibold">当前用户</h2>
            <UserInfoCard v-if="currentUser" :user="currentUser" />
            <p v-else class="text-gray-500">未登录</p>
        </div>

        <UserActions
            :loading="loading"
            :has-current-user="isLoggedIn"
            @fetch="handleFetchUsers"
            @logout="handleLogout"
            @add-user="handleAddUser"
            @reset="handleReset"
        />

        <div v-if="users.length > 0" class="mt-4 rounded border p-4">
            <h2 class="mb-3 font-semibold">用户列表 ({{ userCount }})</h2>
            <div class="space-y-2">
                <UserListItem
                    v-for="user in users"
                    :key="user.id"
                    :user="user"
                    :show-login="!currentUser || currentUser.id !== user.id"
                    @login="handleLogin"
                />
            </div>
        </div>
    </div>
</template>
