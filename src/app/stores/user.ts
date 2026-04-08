import { computed, ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import type { User } from './types';

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<User | null>(null);
    const users = ref<User[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isLoggedIn = computed(() => currentUser.value !== null);
    const isAdmin = computed(() => currentUser.value?.role === 'admin');
    const userCount = computed(() => users.value.length);

    function setCurrentUser(user: User | null) {
        currentUser.value = user;
    }

    function setUsers(userList: User[]) {
        users.value = userList;
    }

    function addUser(user: User) {
        users.value.push(user);
    }

    function updateUser(userId: number, updates: Partial<User>) {
        const index = users.value.findIndex((u) => u.id === userId);
        if (index !== -1) {
            users.value[index] = { ...users.value[index], ...updates };
            if (currentUser.value?.id === userId) {
                currentUser.value = { ...currentUser.value, ...updates };
            }
        }
    }

    function removeUser(userId: number) {
        users.value = users.value.filter((u) => u.id !== userId);
        if (currentUser.value?.id === userId) {
            currentUser.value = null;
        }
    }

    async function login(username: string, password: string): Promise<boolean> {
        loading.value = true;
        error.value = null;
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const user = users.value.find((u) => u.username === username);
            if (user) {
                currentUser.value = user;
                return true;
            }
            error.value = '用户名或密码错误';
            return false;
        } catch (err) {
            error.value = err instanceof Error ? err.message : '登录失败';
            return false;
        } finally {
            loading.value = false;
        }
    }

    function logout() {
        currentUser.value = null;
    }

    function $reset() {
        currentUser.value = null;
        users.value = [];
        loading.value = false;
        error.value = null;
    }

    return {
        currentUser,
        users,
        loading,
        error,
        isLoggedIn,
        isAdmin,
        userCount,
        setCurrentUser,
        setUsers,
        addUser,
        updateUser,
        removeUser,
        login,
        logout,
        $reset,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
