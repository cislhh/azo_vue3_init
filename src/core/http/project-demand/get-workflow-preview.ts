import type { ApiResponse } from '../index';

export interface ProjectDemandWorkflowPreviewNodeDto {
    id: string;
    type: 'circle' | 'rect';
    x: number;
    y: number;
    text: string;
}

export interface ProjectDemandWorkflowPreviewEdgeDto {
    id: string;
    type: 'polyline';
    sourceNodeId: string;
    targetNodeId: string;
    text?: string;
}

export interface ProjectDemandWorkflowPreviewDto {
    nodes: ProjectDemandWorkflowPreviewNodeDto[];
    edges: ProjectDemandWorkflowPreviewEdgeDto[];
}

const projectDemandWorkflowPreviewMockData: ProjectDemandWorkflowPreviewDto = {
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
};

function wait() {
    return new Promise((resolve) => {
        globalThis.setTimeout(resolve, 120);
    });
}

export async function getProjectDemandWorkflowPreview(): Promise<
    ApiResponse<ProjectDemandWorkflowPreviewDto>
> {
    await wait();

    return {
        code: 200,
        data: projectDemandWorkflowPreviewMockData,
        message: 'success',
    };
}
