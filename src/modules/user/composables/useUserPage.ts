import { storeToRefs } from 'pinia';
import { useUserStore } from '@/app/stores/user';

export function useUserPage() {
    const userStore = useUserStore();
    const { currentUser, users, loading, error, isLoggedIn, userCount } = storeToRefs(userStore);

    function handleFetchUsers() {
        userStore.fetchUsers();
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
