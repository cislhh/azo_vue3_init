<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';

import { notifyError } from '@/shared/ui/notification';
import { DocumentEditor } from '@onlyoffice/document-editor-vue';
import { NModal, NSpin } from 'naive-ui';

import {
    buildOnlyOfficeAllowedOrigins,
    buildOnlyOfficePluginDefinitions,
    buildOnlyOfficePluginsConfig,
} from './plugin-config';
import { replyEmpowerToolbarRuntimeContext } from './plugin-runtime';
import type { OnlyOfficeDocumentConfig } from './types';

const props = defineProps<{
    config: OnlyOfficeDocumentConfig | null;
    documentServerUrl: string;
    loading: boolean;
    show: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const pluginDefinitions = computed(() =>
    buildOnlyOfficePluginDefinitions({
        documentType: props.config?.documentType,
        fileType: props.config?.document.fileType,
    }),
);

const allowedOrigins = computed(() =>
    buildOnlyOfficeAllowedOrigins({
        currentOrigin: globalThis.location?.origin,
        documentServerUrl: props.documentServerUrl,
        plugins: pluginDefinitions.value,
    }),
);

const editorConfig = computed<OnlyOfficeDocumentConfig | null>(() => {
    if (!props.config) {
        return null;
    }

    return {
        ...props.config,
        editorConfig: {
            ...props.config.editorConfig,
            plugins: buildOnlyOfficePluginsConfig(pluginDefinitions.value),
        },
    };
});

function handleLoadComponentError(errorCode: number, errorDescription: string) {
    const description = errorDescription.trim() || 'OnlyOffice 组件加载失败';
    notifyError('OnlyOffice 组件加载失败', `[${errorCode}] ${description}`);
}

function handlePluginMessage(event: MessageEvent) {
    if (!props.config) {
        return;
    }

    replyEmpowerToolbarRuntimeContext(event, {
        allowedOrigins: allowedOrigins.value,
        context: {
            fileType: props.config.document.fileType,
            mode: 'edit',
        },
    });
}

function handleUpdateShow(value: boolean) {
    if (!value) {
        emit('close');
    }
}

onMounted(() => {
    window.addEventListener('message', handlePluginMessage);
});

onBeforeUnmount(() => {
    window.removeEventListener('message', handlePluginMessage);
});
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
                    v-else-if="editorConfig"
                    id="project-demand-contract-editor"
                    class="h-full"
                    height="100%"
                    width="100%"
                    :document-server-url="props.documentServerUrl"
                    :config="editorConfig"
                    :on-load-component-error="handleLoadComponentError"
                />

                <div v-else class="flex h-full items-center justify-center text-sm text-[#6b7280]">
                    暂无可加载的合同模板
                </div>
            </div>
        </div>
    </NModal>
</template>
