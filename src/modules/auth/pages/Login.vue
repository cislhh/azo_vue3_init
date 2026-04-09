<script setup lang="ts">
import LoginPanel from '@/modules/auth/components/LoginPanel.vue';
import { useLoginPage } from '@/modules/auth/composables/useLoginPage';

const { form, errorMessage, submitting, submit } = useLoginPage();
</script>

<template>
    <LoginPanel
        :account="form.account"
        :password="form.password"
        :submitting="submitting"
        :error-message="errorMessage"
        @update:account="form.account = $event"
        @update:password="form.password = $event"
        @submit="submit"
    />
</template>
