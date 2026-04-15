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
    type: 'bezier' | 'polyline';
    sourceNodeId: string;
    targetNodeId: string;
    text?: string;
}

export interface ProjectDemandWorkflowPreviewDto {
    nodes: ProjectDemandWorkflowPreviewNodeDto[];
    edges: ProjectDemandWorkflowPreviewEdgeDto[];
}

/**
 * 流程图 mock 配置说明：
 * - nodes：定义画布上的节点，x/y 是节点中心点坐标，可按截图位置微调。
 * - edges：定义节点之间的连线，sourceNodeId/targetNodeId 分别是起点和终点节点 id。
 * - type: 'bezier' 会渲染为更圆滑的曲线；如果后续需要直角折线，可改回 'polyline'。
 * - text：连线上的展示文案，可省略；节点样式暂时使用 LogicFlow 内置样式。
 */
const projectDemandWorkflowPreviewMockData: ProjectDemandWorkflowPreviewDto = {
    nodes: [
        // 开始/结束节点使用 circle，业务审批节点使用 rect。
        { id: 'start', type: 'circle', x: 120, y: 110, text: '开始' },
        { id: 'leader', type: 'rect', x: 760, y: 110, text: '项目负责人' },
        { id: 'manager', type: 'rect', x: 1360, y: 560, text: '主管领导' },
        { id: 'office', type: 'rect', x: 360, y: 560, text: '项目管理科' },
        { id: 'end', type: 'circle', x: 60, y: 560, text: '结束' },
    ],
    edges: [
        // 所有连线先统一使用 bezier，让流程图整体带一点曲线感。
        {
            id: 'edge-start-leader',
            type: 'bezier',
            sourceNodeId: 'start',
            targetNodeId: 'leader',
        },
        {
            id: 'edge-leader-manager',
            type: 'bezier',
            sourceNodeId: 'leader',
            targetNodeId: 'manager',
            text: '主管领导',
        },
        {
            id: 'edge-manager-leader',
            type: 'bezier',
            sourceNodeId: 'manager',
            targetNodeId: 'leader',
            text: '项目预审人',
        },
        {
            id: 'edge-manager-office',
            type: 'bezier',
            sourceNodeId: 'manager',
            targetNodeId: 'office',
            text: '项目管理科',
        },
        {
            id: 'edge-office-leader',
            type: 'bezier',
            sourceNodeId: 'office',
            targetNodeId: 'leader',
        },
        {
            id: 'edge-office-end',
            type: 'bezier',
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
