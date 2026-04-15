import { describe, expect, it } from 'vitest';

import { getProjectDemandContractTemplate } from './get-contract-template';

describe('getProjectDemandContractTemplate', () => {
    it('uses the current Word template and a cache-busting key for product requirements', async () => {
        const response = await getProjectDemandContractTemplate({
            contractType: '产品需求',
        });

        expect(response.data).toMatchObject({
            documentType: 'word',
            documentUrl: '/new.docx',
            fileType: 'docx',
            title: '产品需求文档模板.docx',
        });
        expect(response.data.documentKey).toMatch(/^project-demand-product-requirement-new-docx-/);
    });
});
