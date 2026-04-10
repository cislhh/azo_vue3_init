import { describe, expect, it } from 'vitest';

import { getProjectDemandContractTemplate } from './get-contract-template';

describe('getProjectDemandContractTemplate', () => {
    it('技术开发返回 pdf 模板', async () => {
        await expect(
            getProjectDemandContractTemplate({
                contractType: '技术开发',
            }),
        ).resolves.toMatchObject({
            data: {
                documentType: 'pdf',
                documentUrl: '/test.pdf',
                fileType: 'pdf',
                title: '技术开发合同模板.pdf',
            },
        });
    });

    it('产品需求返回 docx 模板', async () => {
        await expect(
            getProjectDemandContractTemplate({
                contractType: '产品需求',
            }),
        ).resolves.toMatchObject({
            data: {
                documentType: 'word',
                documentUrl: '/old.docx',
                fileType: 'docx',
                title: '产品需求文档模板.docx',
            },
        });
    });

    it('接口文档返回 xlsx 模板', async () => {
        await expect(
            getProjectDemandContractTemplate({
                contractType: '接口文档',
            }),
        ).resolves.toMatchObject({
            data: {
                documentType: 'cell',
                documentUrl: '/test.xlsx',
                fileType: 'xlsx',
                title: '接口文档模板.xlsx',
            },
        });
    });
});
