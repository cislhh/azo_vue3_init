import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useProjectDemandPage } from './useProjectDemandPage';

vi.mock('@/core/http/api', () => ({
    api: {
        projectDemand: {
            getContractTemplate: vi.fn(),
        },
    },
}));

describe('useProjectDemandPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.stubEnv('VITE_ONLYOFFICE_URL', 'http://localhost:80');
        vi.stubEnv('VITE_FILE_ACCESS_HOST', '');
        vi.stubGlobal('location', {
            origin: 'http://localhost:5173',
        });
    });

    it('选择合同类型后可以请求模板并打开编辑器', async () => {
        const { api } = await import('@/core/http/api');

        vi.mocked(api.projectDemand.getContractTemplate).mockResolvedValue({
            code: 200,
            message: 'success',
            data: {
                documentKey: 'project-demand-technical-development',
                documentType: 'pdf',
                documentUrl: '/test.pdf',
                fileType: 'pdf',
                title: '技术开发合同模板.pdf',
            },
        });

        const page = useProjectDemandPage();
        page.form.contractType = '技术开发';

        await page.openContractEditor();

        expect(api.projectDemand.getContractTemplate).toHaveBeenCalledWith({
            contractType: '技术开发',
        });
        expect(page.contractEditorVisible.value).toBe(true);
        expect(page.contractEditorConfig.value?.document.url).toBe(
            'http://localhost:5173/test.pdf',
        );
    });

    it('合同类型选项包含技术开发和产品需求', () => {
        const page = useProjectDemandPage();

        expect(page.contractTypeOptions.value).toEqual([
            { label: '技术开发', value: '技术开发' },
            { label: '产品需求', value: '产品需求' },
            { label: '接口文档', value: '接口文档' },
        ]);
    });
});
