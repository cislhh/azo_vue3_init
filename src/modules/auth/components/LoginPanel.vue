<script setup lang="ts">
import { NAlert } from 'naive-ui';
import LoginForm from './LoginForm.vue';

interface Props {
    account: string;
    password: string;
    submitting?: boolean;
    errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
    submitting: false,
    errorMessage: '',
});

const emit = defineEmits<{
    'update:account': [value: string];
    'update:password': [value: string];
    submit: [];
}>();
</script>

<template>
    <div class="min-h-screen bg-slate-100 px-4 py-12">
        <div class="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
            <div class="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <section
                    class="hidden rounded-3xl bg-slate-900 p-10 text-white shadow-2xl lg:block"
                >
                    <div class="max-w-md space-y-6">
                        <span
                            class="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm text-slate-200"
                        >
                            安全登录入口
                        </span>
                        <div class="space-y-3">
                            <h2 class="text-4xl leading-tight font-semibold">
                                统一身份登录，快速进入业务工作台
                            </h2>
                        </div>
                    </div>
                </section>

                <section
                    class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60"
                >
                    <div class="mb-8 space-y-2 text-center">
                        <p class="text-sm font-medium tracking-[0.3em] text-slate-500 uppercase">
                            Azo Admin
                        </p>
                        <h1 class="text-3xl font-semibold text-slate-900">登录账号</h1>
                        <p class="text-sm text-slate-500">请输入账号信息后进入系统首页。</p>
                    </div>

                    <NAlert v-if="props.errorMessage" type="error" class="mb-4">
                        {{ props.errorMessage }}
                    </NAlert>

                    <LoginForm
                        :account="props.account"
                        :password="props.password"
                        :submitting="props.submitting"
                        @update:account="emit('update:account', $event)"
                        @update:password="emit('update:password', $event)"
                        @submit="emit('submit')"
                    />
                </section>
            </div>
        </div>
    </div>
</template>
