<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput } from 'naive-ui';

interface Props {
    account: string;
    password: string;
    submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    submitting: false,
});

const emit = defineEmits<{
    'update:account': [value: string];
    'update:password': [value: string];
    submit: [];
}>();
</script>

<template>
    <NForm class="space-y-4" @submit.prevent="emit('submit')">
        <NFormItem label="账号">
            <NInput
                :value="props.account"
                placeholder="请输入账号或邮箱"
                @update:value="emit('update:account', $event)"
            />
        </NFormItem>

        <NFormItem label="密码">
            <NInput
                type="password"
                show-password-on="click"
                :value="props.password"
                placeholder="请输入密码"
                @update:value="emit('update:password', $event)"
            />
        </NFormItem>

        <NButton type="primary" block attr-type="submit" :loading="props.submitting">
            登录
        </NButton>
    </NForm>
</template>
