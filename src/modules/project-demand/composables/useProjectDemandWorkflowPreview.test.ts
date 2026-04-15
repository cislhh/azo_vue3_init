import { afterEach, describe, expect, it, vi } from 'vitest';

const { render, destroy, LogicFlowMock } = vi.hoisted(() => {
    const render = vi.fn();
    const destroy = vi.fn();
    const LogicFlowMock = vi.fn(
        class {
            render = render;
            destroy = destroy;
        },
    );

    return {
        render,
        destroy,
        LogicFlowMock,
    };
});

vi.mock('@logicflow/core', () => ({
    default: LogicFlowMock,
}));

import { useProjectDemandWorkflowPreview } from './useProjectDemandWorkflowPreview';

describe('useProjectDemandWorkflowPreview', () => {
    afterEach(() => {
        render.mockReset();
        destroy.mockReset();
        LogicFlowMock.mockClear();
    });

    it('opens and closes the workflow preview with fixed graph data', () => {
        const preview = useProjectDemandWorkflowPreview();

        expect(preview.previewVisible.value).toBe(false);
        expect(preview.graphData.nodes).toHaveLength(6);
        expect(preview.graphData.edges).toHaveLength(5);

        preview.openWorkflowPreview();

        expect(preview.previewVisible.value).toBe(true);

        preview.closeWorkflowPreview();

        expect(preview.previewVisible.value).toBe(false);
    });

    it('creates and destroys a LogicFlow instance around the preview lifecycle', () => {
        const preview = useProjectDemandWorkflowPreview();
        const container = {} as HTMLDivElement;

        preview.openWorkflowPreview();
        preview.initializeWorkflowPreview(container);

        expect(LogicFlowMock).toHaveBeenCalledOnce();
        expect(render).toHaveBeenCalledWith(preview.graphData);

        preview.closeWorkflowPreview();

        expect(destroy).toHaveBeenCalledOnce();
    });
});
