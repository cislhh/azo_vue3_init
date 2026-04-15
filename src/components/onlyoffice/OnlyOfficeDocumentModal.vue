<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue';

import { notifyError } from '@/shared/ui/notification';
import { DocumentEditor } from '@onlyoffice/document-editor-vue';
import { NModal, NSpin } from 'naive-ui';

import { handleEmpowerToolbarCompareMessage } from './compare-runtime';
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

const editorInstance = shallowRef<{
    setRevisedFile?: (payload: { fileType: 'docx'; token?: string; url: string }) => void;
} | null>(null);

const pluginDefinitions = computed(() =>
    buildOnlyOfficePluginDefinitions({
        documentType: props.config?.documentType,
        fileType: props.config?.document.fileType,
        pluginVersion: import.meta.env.VITE_ONLYOFFICE_TOOLBAR_PLUGIN_VERSION,
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

async function handlePluginMessage(event: MessageEvent) {
    if (!props.config) {
        return;
    }

    try {
        const compareHandled = await handleEmpowerToolbarCompareMessage(event, {
            allowedOrigins: allowedOrigins.value,
            editor: editorInstance.value,
            revisedFile: props.config.editorConfig.revisedFile ?? null,
        });

        if (compareHandled) {
            return;
        }
    } catch (error) {
        notifyError(error instanceof Error ? error.message : '触发文档对比失败');
        return;
    }

    replyEmpowerToolbarRuntimeContext(event, {
        allowedOrigins: allowedOrigins.value,
        context: {
            fileType: props.config.document.fileType,
            mode: 'edit',
            stampImageUrl: props.config.editorConfig.stampImageUrl,
        },
    });
}

function handleUpdateShow(value: boolean) {
    if (!value) {
        emit('close');
    }
}

function handleDocumentReady() {
    const globalScope = window as typeof window & {
        DocEditor?: {
            instances?: Record<
                string,
                {
                    setRevisedFile?: (payload: {
                        fileType: 'docx';
                        token?: string;
                        url: string;
                    }) => void;
                }
            >;
        };
    };

    editorInstance.value =
        globalScope.DocEditor?.instances?.['project-demand-contract-editor'] ?? null;
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
                    :events_onDocumentReady="handleDocumentReady"
                    :on-load-component-error="handleLoadComponentError"
                />

                <div v-else class="flex h-full items-center justify-center text-sm text-[#6b7280]">
                    暂无可加载的合同模板
                </div>
            </div>
        </div>
    </NModal>
</template>
