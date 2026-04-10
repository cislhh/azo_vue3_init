<script setup lang="ts">
import { notifyError } from '@/shared/ui/notification';
import { DocumentEditor } from '@onlyoffice/document-editor-vue';
import { NModal, NSpin } from 'naive-ui';
import type { OnlyOfficeDocumentConfig } from '../composables/useProjectDemandPage';

const props = defineProps<{
    show: boolean;
    loading: boolean;
    documentServerUrl: string;
    config: OnlyOfficeDocumentConfig | null;
}>();

const emit = defineEmits<{
    close: [];
}>();

function handleLoadComponentError(errorCode: number, errorDescription: string) {
    const description = errorDescription.trim() || 'OnlyOffice 组件加载失败';
    notifyError('OnlyOffice 组件加载失败', `[${errorCode}] ${description}`);
}

function handleUpdateShow(value: boolean) {
    if (!value) {
        emit('close');
    }
}
</script>

<template>
    <NModal
        :show="props.show"
        preset="card"
        class="mx-auto my-6 h-screen max-w-none"
        :mask-closable="false"
        @update:show="handleUpdateShow"
    >
        <div class="flex h-full min-h-0 flex-col">
            <div class="min-h-0 flex-1 overflow-hidden rounded-sm border border-[#e5e7eb]">
                <div v-if="props.loading" class="flex h-full items-center justify-center">
                    <NSpin size="large" />
                </div>

                <DocumentEditor
                    v-else-if="props.config"
                    id="project-demand-contract-editor"
                    class="h-full"
                    :document-server-url="props.documentServerUrl"
                    :config="props.config"
                    :on-load-component-error="handleLoadComponentError"
                />

                <div v-else class="flex h-full items-center justify-center text-sm text-[#6b7280]">
                    暂无可加载的合同模板
                </div>
            </div>
        </div>
    </NModal>
</template>
