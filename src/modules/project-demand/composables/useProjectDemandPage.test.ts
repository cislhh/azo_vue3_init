import { afterEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/core/http/api';

import { useProjectDemandPage } from './useProjectDemandPage';

vi.mock('@/core/http/api', () => ({
    api: {
        projectDemand: {
            getContractTemplate: vi.fn(async () => ({
                code: 200,
                data: {
                    documentKey: 'project-demand-product-requirement-new-docx-test',
                    documentType: 'word',
                    documentUrl: '/new.docx',
                    fileType: 'docx',
                    title: '产品需求文档模板.docx',
                },
                message: 'success',
            })),
            getStampResource: vi.fn(async () => ({
                code: 200,
                data: {
                    imageUrl: '/z.png',
                },
                message: 'success',
            })),
        },
    },
}));

describe('useProjectDemandPage OnlyOffice editor setup', () => {
    const originalDocumentServerUrl = import.meta.env.VITE_ONLYOFFICE_URL;

    afterEach(() => {
        import.meta.env.VITE_ONLYOFFICE_URL = originalDocumentServerUrl;
        vi.restoreAllMocks();
    });

    it('injects the development stamp image URL when opening a Word contract template', async () => {
        import.meta.env.VITE_ONLYOFFICE_URL = 'http://localhost/onlyoffice';

        const page = useProjectDemandPage();
        page.updateFormField('contractType', '产品需求');

        const stampSpy = vi.spyOn(api.projectDemand, 'getStampResource');

        await page.openContractEditor();

        expect(stampSpy).toHaveBeenCalledOnce();
        expect(page.contractEditorConfig.value).toMatchObject({
            document: {
                fileType: 'docx',
                title: '产品需求文档模板.docx',
            },
            documentType: 'word',
            editorConfig: {
                revisedFile: {
                    fileType: 'docx',
                    url: '/old.docx',
                },
                stampImageUrl: '/z.png',
            },
        });
        expect(page.contractEditorVisible.value).toBe(true);
    });
});
