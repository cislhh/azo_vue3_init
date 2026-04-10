import type { ApiResponse } from '../index';

export interface GetProjectDemandContractTemplateInput {
    contractType: string;
}

export interface ProjectDemandContractTemplateDto {
    documentUrl: string;
    fileType: 'doc' | 'docx' | 'pdf' | 'xlsx';
    documentType: 'cell' | 'pdf' | 'word';
    title: string;
    documentKey: string;
    callbackUrl?: string;
    token?: string;
}

export async function getProjectDemandContractTemplate(
    input: GetProjectDemandContractTemplateInput,
): Promise<ApiResponse<ProjectDemandContractTemplateDto>> {
    if (input.contractType === '技术开发') {
        return {
            code: 200,
            message: 'success',
            data: {
                documentUrl: '/test.pdf',
                fileType: 'pdf',
                documentType: 'pdf',
                title: '技术开发合同模板.pdf',
                documentKey: 'project-demand-technical-development',
            },
        };
    }

    if (input.contractType === '产品需求') {
        return {
            code: 200,
            message: 'success',
            data: {
                documentUrl: '/old.docx',
                fileType: 'docx',
                documentType: 'word',
                title: '产品需求文档模板.docx',
                documentKey: 'project-demand-product-requirement',
            },
        };
    }

    if (input.contractType === '接口文档') {
        return {
            code: 200,
            message: 'success',
            data: {
                documentUrl: '/test.xlsx',
                fileType: 'xlsx',
                documentType: 'cell',
                title: '接口文档模板.xlsx',
                documentKey: 'project-demand-api-specification',
            },
        };
    }

    throw new Error('当前合同类型暂无可用模板');
}
