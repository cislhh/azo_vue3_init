import LogicFlow from '@logicflow/core';
import { shallowRef } from 'vue';

export interface ProjectDemandWorkflowNode {
    id: string;
    type: 'circle' | 'rect';
    x: number;
    y: number;
    text: string;
}

export interface ProjectDemandWorkflowEdge {
    id: string;
    type: 'polyline';
    sourceNodeId: string;
    targetNodeId: string;
}

export interface ProjectDemandWorkflowGraphData {
    nodes: ProjectDemandWorkflowNode[];
    edges: ProjectDemandWorkflowEdge[];
}

const projectDemandWorkflowGraphData: ProjectDemandWorkflowGraphData = {
    nodes: [
        { id: 'start', type: 'circle', x: 140, y: 120, text: '开始' },
        { id: 'submit', type: 'rect', x: 340, y: 120, text: '项目负责人提交' },
        { id: 'college', type: 'rect', x: 540, y: 120, text: '学院审核' },
        { id: 'research', type: 'rect', x: 740, y: 120, text: '科研院审核' },
        { id: 'finance', type: 'rect', x: 940, y: 120, text: '财务确认' },
        { id: 'end', type: 'circle', x: 1140, y: 120, text: '结束' },
    ],
    edges: [
        {
            id: 'edge-start-submit',
            type: 'polyline',
            sourceNodeId: 'start',
            targetNodeId: 'submit',
        },
        {
            id: 'edge-submit-college',
            type: 'polyline',
            sourceNodeId: 'submit',
            targetNodeId: 'college',
        },
        {
            id: 'edge-college-research',
            type: 'polyline',
            sourceNodeId: 'college',
            targetNodeId: 'research',
        },
        {
            id: 'edge-research-finance',
            type: 'polyline',
            sourceNodeId: 'research',
            targetNodeId: 'finance',
        },
        { id: 'edge-finance-end', type: 'polyline', sourceNodeId: 'finance', targetNodeId: 'end' },
    ],
};

export function useProjectDemandWorkflowPreview() {
    const previewVisible = shallowRef(false);
    const previewError = shallowRef('');
    const logicFlow = shallowRef<LogicFlow | null>(null);

    function openWorkflowPreview() {
        previewVisible.value = true;
        previewError.value = '';
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
                isSilentMode: true,
                stopMoveGraph: false,
                stopScrollGraph: false,
                stopZoomGraph: false,
                adjustEdge: false,
                adjustNodePosition: false,
                hideAnchors: true,
                textEdit: false,
            });

            instance.render(projectDemandWorkflowGraphData);
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
        graphData: projectDemandWorkflowGraphData,
        openWorkflowPreview,
        closeWorkflowPreview,
        initializeWorkflowPreview,
        destroyWorkflowPreview,
    };
}
