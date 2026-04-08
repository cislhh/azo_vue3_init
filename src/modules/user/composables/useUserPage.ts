import { storeToRefs } from 'pinia';
import { useUserStore } from '@/app/stores/user';
import { api } from '@/core/http/api';

export function useUserPage() {
    const userStore = useUserStore();
    const { currentUser, users, loading, error, isLoggedIn, userCount } = storeToRefs(userStore);

    async function handleFetchUsers() {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.users.getAll();
            const mappedUsers = response.data.map((u) => ({
                id: u.id,
                username: u.username,
                email: u.email,
                role: 'user' as const,
                createdAt: new Date().toISOString(),
            }));
            userStore.setUsers(mappedUsers);
        } catch (err) {
            error.value = err instanceof Error ? err.message : '获取用户列表失败';
        } finally {
            loading.value = false;
        }
    }

    function handleLogin(username: string) {
        userStore.login(username, 'password');
    }

    function handleLogout() {
        userStore.logout();
    }

    function handleAddUser() {
        const newUser = {
            id: Date.now(),
            username: `user${Date.now()}`,
            email: `user${Date.now()}@example.com`,
            role: 'user' as const,
            createdAt: new Date().toISOString(),
        };
        userStore.addUser(newUser);
    }

    function handleReset() {
        userStore.$reset();
    }

    return {
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
    };
}
