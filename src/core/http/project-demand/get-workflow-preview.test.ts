import { describe, expect, it } from 'vitest';

import { getProjectDemandWorkflowPreview } from './get-workflow-preview';

describe('getProjectDemandWorkflowPreview', () => {
    it('returns the mock workflow graph data for preview rendering', async () => {
        const response = await getProjectDemandWorkflowPreview();

        expect(response.code).toBe(200);
        expect(response.message).toBe('success');
        expect(response.data.nodes).toHaveLength(5);
        expect(response.data.edges).toHaveLength(6);
        expect(response.data.nodes.map((node) => node.text)).toEqual([
            '开始',
            '项目负责人',
            '主管领导',
            '项目管理科',
            '结束',
        ]);
        expect(response.data.edges.every((edge) => edge.type === 'bezier')).toBe(true);
    });
});
