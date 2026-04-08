import { ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';

export type AuthorityButton = Record<string, unknown> | string | number;

export const usePermissionStore = defineStore('permission', () => {
    const authorityBtns = ref<AuthorityButton[]>([]);

    function setAuthorityBtns(buttons: AuthorityButton[] | null | undefined) {
        authorityBtns.value = Array.isArray(buttons) ? buttons : [];
    }

    function clearAuthorityBtns() {
        authorityBtns.value = [];
    }

    return {
        authorityBtns,
        setAuthorityBtns,
        clearAuthorityBtns,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePermissionStore, import.meta.hot));
}
