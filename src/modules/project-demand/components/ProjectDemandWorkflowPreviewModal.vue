<script setup lang="ts">
import '@logicflow/core/lib/index.css';

import { NButton, NModal, NSpin } from 'naive-ui';
import { nextTick, useTemplateRef, watch } from 'vue';

const props = defineProps<{
    errorMessage: string;
    loading: boolean;
    show: boolean;
}>();

const emit = defineEmits<{
    close: [];
    initialize: [container: HTMLDivElement | null];
}>();

const containerRef = useTemplateRef<HTMLDivElement>('container');

function handleUpdateShow(value: boolean) {
    if (!value) {
        emit('close');
    }
}

watch(
    () => [props.show, props.loading, props.errorMessage] as const,
    async ([show, loading, errorMessage]) => {
        if (!show || loading || errorMessage) {
            return;
        }

        await nextTick();
        emit('initialize', containerRef.value ?? null);
    },
);
</script>

<template>
    <NModal
        :show="props.show"
        preset="card"
        class="mx-auto my-4 h-[92vh] max-w-none"
        style="width: 96vw"
        @update:show="handleUpdateShow"
    >
        <div class="flex h-full min-h-0 flex-col">
            <div class="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 class="text-xl font-semibold text-[#22324d]">流程预览</h2>
                    <p class="mt-1 text-sm text-[#6b7280]"
                        >可查看固定审批流，支持拖拽和平移缩放。</p
                    >
                </div>
                <NButton secondary @click="$emit('close')">关闭</NButton>
            </div>

            <div
                v-if="props.errorMessage"
                class="flex flex-1 items-center justify-center rounded-sm border border-[#fecaca] bg-[#fff1f2] text-sm text-[#be123c]"
            >
                {{ props.errorMessage }}
            </div>

            <div
                v-else-if="props.loading"
                class="flex flex-1 items-center justify-center rounded-sm border border-[#e5e7eb] bg-white"
            >
                <NSpin size="large" />
            </div>

            <div
                v-else
                ref="container"
                class="min-h-0 flex-1 overflow-hidden rounded-sm border border-[#e5e7eb] bg-white"
            />
        </div>
    </NModal>
</template>
