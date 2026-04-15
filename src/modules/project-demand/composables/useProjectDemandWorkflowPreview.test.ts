import { afterEach, describe, expect, it, vi } from 'vitest';

const { render, destroy, updateEditConfig, LogicFlowMock, getWorkflowPreview } = vi.hoisted(() => {
    const render = vi.fn();
    const destroy = vi.fn();
    const updateEditConfig = vi.fn();
    const LogicFlowMock = vi.fn(
        class {
            render = render;
            destroy = destroy;
            updateEditConfig = updateEditConfig;
        },
    );
    const getWorkflowPreview = vi.fn(async () => ({
        code: 200,
        message: 'success',
        data: {
            nodes: [
                { id: 'start', type: 'circle', x: 120, y: 110, text: '开始' },
                { id: 'leader', type: 'rect', x: 760, y: 110, text: '项目负责人' },
                { id: 'manager', type: 'rect', x: 1360, y: 560, text: '主管领导' },
                { id: 'office', type: 'rect', x: 360, y: 560, text: '项目管理科' },
                { id: 'end', type: 'circle', x: 60, y: 560, text: '结束' },
            ],
            edges: [
                {
                    id: 'edge-start-leader',
                    type: 'polyline',
                    sourceNodeId: 'start',
                    targetNodeId: 'leader',
                },
                {
                    id: 'edge-leader-manager',
                    type: 'polyline',
                    sourceNodeId: 'leader',
                    targetNodeId: 'manager',
                    text: '主管领导',
                },
                {
                    id: 'edge-manager-leader',
                    type: 'polyline',
                    sourceNodeId: 'manager',
                    targetNodeId: 'leader',
                    text: '项目预审人',
                },
                {
                    id: 'edge-manager-office',
                    type: 'polyline',
                    sourceNodeId: 'manager',
                    targetNodeId: 'office',
                    text: '项目管理科',
                },
                {
                    id: 'edge-office-leader',
                    type: 'polyline',
                    sourceNodeId: 'office',
                    targetNodeId: 'leader',
                },
                {
                    id: 'edge-office-end',
                    type: 'polyline',
                    sourceNodeId: 'office',
                    targetNodeId: 'end',
                },
            ],
        },
    }));

    return {
        render,
        destroy,
        updateEditConfig,
        LogicFlowMock,
        getWorkflowPreview,
    };
});

vi.mock('@logicflow/core', () => ({
    default: LogicFlowMock,
}));

vi.mock('@/core/http/api', () => ({
    api: {
        projectDemand: {
            getWorkflowPreview,
        },
    },
}));

import { useProjectDemandWorkflowPreview } from './useProjectDemandWorkflowPreview';

describe('useProjectDemandWorkflowPreview', () => {
    afterEach(() => {
        render.mockReset();
        destroy.mockReset();
        updateEditConfig.mockReset();
        LogicFlowMock.mockClear();
        getWorkflowPreview.mockClear();
    });

    it('opens and closes the workflow preview around loaded graph data', async () => {
        const preview = useProjectDemandWorkflowPreview();

        expect(preview.previewVisible.value).toBe(false);

        await preview.openWorkflowPreview();

        expect(preview.previewVisible.value).toBe(true);
        expect(getWorkflowPreview).toHaveBeenCalledOnce();
        expect(preview.graphData.value.nodes).toHaveLength(5);
        expect(preview.graphData.value.edges).toHaveLength(6);

        preview.closeWorkflowPreview();

        expect(preview.previewVisible.value).toBe(false);
    });

    it('creates and destroys a LogicFlow instance around the preview lifecycle', async () => {
        const preview = useProjectDemandWorkflowPreview();
        const container = {} as HTMLDivElement;

        await preview.openWorkflowPreview();
        preview.initializeWorkflowPreview(container);

        expect(LogicFlowMock).toHaveBeenCalledOnce();
        expect(LogicFlowMock).toHaveBeenCalledWith(
            expect.objectContaining({
                isSilentMode: false,
                textEdit: false,
            }),
        );
        expect(updateEditConfig).toHaveBeenCalledWith(
            expect.objectContaining({
                adjustNodePosition: true,
            }),
        );
        expect(render).toHaveBeenCalledWith(preview.graphData.value);

        preview.closeWorkflowPreview();

        expect(destroy).toHaveBeenCalledOnce();
    });
});
