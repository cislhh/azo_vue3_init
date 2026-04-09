import { reactive, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/app/stores';
import type { UserSessionPayload } from '@/app/stores';
import { api } from '@/core/http/api';

const WHITESPACE_PATTERN = /\s/u;

function hasWhitespace(value: string) {
    return WHITESPACE_PATTERN.test(value);
}

function validateEmail(account: string) {
    const parts = account.split('@');

    if (parts.length !== 2) {
        return false;
    }

    const [localPart, domainPart] = parts;
    if (!localPart || !domainPart || hasWhitespace(localPart) || hasWhitespace(domainPart)) {
        return false;
    }

    const domainSegments = domainPart.split('.');
    return domainSegments.length >= 2 && domainSegments.every(Boolean);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isUserSessionPayload(value: unknown): value is UserSessionPayload {
    if (!isRecord(value)) {
        return false;
    }

    const user = value.user;
    const permissions = value.permissions;

    return (
        typeof value.token === 'string' &&
        isRecord(user) &&
        (typeof user.id === 'number' || typeof user.id === 'string') &&
        typeof user.name === 'string' &&
        typeof user.account === 'string' &&
        typeof user.email === 'string' &&
        Array.isArray(permissions) &&
        permissions.every((item) => {
            return (
                isRecord(item) &&
                typeof item.key === 'string' &&
                typeof item.label === 'string' &&
                typeof item.path === 'string'
            );
        })
    );
}

export function useLoginPage() {
    const router = useRouter();
    const userStore = useUserStore();
    const form = reactive({
        account: '',
        password: '',
    });
    const submitting = shallowRef(false);
    const errorMessage = shallowRef('');

    if (userStore.isLoggedIn) {
        void router.replace('/home');
    }

    function getValidationError() {
        const account = form.account.trim();
        const password = form.password.trim();

        if (!account) {
            return '请输入账号';
        }

        if (!password) {
            return '请输入密码';
        }

        if (account.includes('@') && !validateEmail(account)) {
            return '请输入正确的邮箱账号';
        }

        return '';
    }

    async function submit() {
        if (submitting.value) {
            return;
        }

        const validationError = getValidationError();
        if (validationError) {
            errorMessage.value = validationError;
            return;
        }

        submitting.value = true;
        errorMessage.value = '';

        try {
            const payload = await api.auth.login({
                account: form.account.trim(),
                password: form.password,
            });

            if (!isUserSessionPayload(payload)) {
                throw new Error('登录返回数据格式错误');
            }

            userStore.loginSuccess(payload);
            await router.push('/home');
        } catch (error) {
            errorMessage.value = error instanceof Error ? error.message : '登录失败，请稍后重试';
        } finally {
            submitting.value = false;
        }
    }

    return {
        form,
        submitting,
        errorMessage,
        submit,
    };
}
