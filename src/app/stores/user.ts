import { computed, ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { usePermissionStore } from './permission';
import type { PermissionEntry, User, UserSessionPayload } from './types';

export const USER_SESSION_STORAGE_KEY = 'user-session';

function isUser(value: unknown): value is User {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const candidate = value as Record<string, unknown>;
    const hasValidId = typeof candidate.id === 'number' || typeof candidate.id === 'string';

    return (
        hasValidId &&
        typeof candidate.name === 'string' &&
        typeof candidate.account === 'string' &&
        typeof candidate.email === 'string'
    );
}

function isPermissionEntry(value: unknown): value is PermissionEntry {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
        typeof candidate.key === 'string' &&
        typeof candidate.label === 'string' &&
        typeof candidate.path === 'string'
    );
}

function isUserSessionPayload(value: unknown): value is UserSessionPayload {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
        typeof candidate.token === 'string' &&
        isUser(candidate.user) &&
        Array.isArray(candidate.permissions) &&
        candidate.permissions.every(isPermissionEntry)
    );
}

export function getPersistedSessionToken() {
    if (typeof localStorage === 'undefined') {
        return null;
    }

    const rawSession = localStorage.getItem(USER_SESSION_STORAGE_KEY);
    if (!rawSession) {
        return null;
    }

    try {
        const parsedSession = JSON.parse(rawSession) as unknown;
        return isUserSessionPayload(parsedSession) ? parsedSession.token : null;
    } catch {
        return null;
    }
}

export const useUserStore = defineStore('user', () => {
    const permissionStore = usePermissionStore();
    const token = ref<string | null>(null);
    const currentUser = ref<User | null>(null);
    const permissions = ref<PermissionEntry[]>([]);
    const initialized = ref(false);

    const isLoggedIn = computed(() => Boolean(token.value && currentUser.value));

    function syncPermissionStore(entries: PermissionEntry[]) {
        permissionStore.setAuthorityBtns(entries);
    }

    function applySession(payload: UserSessionPayload) {
        token.value = payload.token;
        currentUser.value = payload.user;
        permissions.value = payload.permissions;
        initialized.value = true;
        syncPermissionStore(payload.permissions);
    }

    function clearSessionState() {
        token.value = null;
        currentUser.value = null;
        permissions.value = [];
        initialized.value = true;
        permissionStore.clearAuthorityBtns();
    }

    function persistSession(payload: UserSessionPayload) {
        if (typeof localStorage === 'undefined') {
            return;
        }

        localStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(payload));
    }

    function clearPersistedSession() {
        if (typeof localStorage === 'undefined') {
            return;
        }

        localStorage.removeItem(USER_SESSION_STORAGE_KEY);
    }

    function loginSuccess(payload: UserSessionPayload) {
        applySession(payload);
        persistSession(payload);
    }

    function restoreSession() {
        if (typeof localStorage === 'undefined') {
            clearSessionState();
            return;
        }

        const rawSession = localStorage.getItem(USER_SESSION_STORAGE_KEY);
        if (!rawSession) {
            clearPersistedSession();
            clearSessionState();
            return;
        }

        try {
            const parsedSession = JSON.parse(rawSession) as unknown;
            if (!isUserSessionPayload(parsedSession)) {
                throw new Error('invalid session payload');
            }

            applySession(parsedSession);
        } catch {
            clearPersistedSession();
            clearSessionState();
        }
    }

    function logout() {
        clearPersistedSession();
        clearSessionState();
    }

    return {
        token,
        currentUser,
        permissions,
        initialized,
        isLoggedIn,
        loginSuccess,
        restoreSession,
        logout,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
