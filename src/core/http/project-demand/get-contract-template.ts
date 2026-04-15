import type { ApiResponse } from '../index';

const ONLYOFFICE_KEY_MAX_LENGTH = 128;

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

function createMockDocumentKey(baseKey: string) {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const maxBaseLength = Math.max(1, ONLYOFFICE_KEY_MAX_LENGTH - suffix.length - 1);

    return `${baseKey.slice(0, maxBaseLength)}-${suffix}`;
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
                documentUrl: '/new.docx',
                fileType: 'docx',
                documentType: 'word',
                title: '产品需求文档模板.docx',
                documentKey: createMockDocumentKey('project-demand-product-requirement-new-docx'),
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
