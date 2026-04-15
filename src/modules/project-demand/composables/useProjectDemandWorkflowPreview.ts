import LogicFlow from '@logicflow/core';
import { shallowRef } from 'vue';

import { api } from '@/core/http/api';
import type { ProjectDemandWorkflowPreviewDto } from '@/core/http/project-demand/get-workflow-preview';

export function useProjectDemandWorkflowPreview() {
    const previewVisible = shallowRef(false);
    const previewError = shallowRef('');
    const previewLoading = shallowRef(false);
    const graphData = shallowRef<ProjectDemandWorkflowPreviewDto>({
        nodes: [],
        edges: [],
    });
    const logicFlow = shallowRef<LogicFlow | null>(null);

    async function openWorkflowPreview() {
        previewVisible.value = true;
        previewError.value = '';
        previewLoading.value = true;

        try {
            const response = await api.projectDemand.getWorkflowPreview();
            graphData.value = response.data;
        } catch (error) {
            previewError.value =
                error instanceof Error ? error.message : '流程图加载失败，请稍后重试';
        } finally {
            previewLoading.value = false;
        }
    }

    function destroyWorkflowPreview() {
        logicFlow.value?.destroy();
        logicFlow.value = null;
    }

    function initializeWorkflowPreview(container: HTMLElement | null) {
        if (!previewVisible.value || !container || logicFlow.value) {
            return;
        }

        previewError.value = '';

        try {
            const instance = new LogicFlow({
                container,
                grid: false,
                background: {
                    backgroundColor: '#f8fafc',
                },
                isSilentMode: false,
                stopMoveGraph: false,
                stopScrollGraph: false,
                stopZoomGraph: false,
                adjustEdge: false,
                hideAnchors: true,
                textEdit: false,
            });

            instance.updateEditConfig({
                adjustEdge: false,
                adjustNodePosition: true,
                hideAnchors: true,
                textEdit: false,
            });
            instance.render(graphData.value);
            logicFlow.value = instance;
        } catch (error) {
            previewError.value =
                error instanceof Error ? error.message : '流程图加载失败，请稍后重试';
        }
    }

    function closeWorkflowPreview() {
        previewVisible.value = false;
        destroyWorkflowPreview();
    }

    return {
        previewVisible,
        previewError,
        previewLoading,
        graphData,
        openWorkflowPreview,
        closeWorkflowPreview,
        initializeWorkflowPreview,
        destroyWorkflowPreview,
    };
}
