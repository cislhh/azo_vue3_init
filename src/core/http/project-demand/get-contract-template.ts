import type { ApiResponse } from '../index';

export interface GetProjectDemandContractTemplateInput {
    contractType: string;
}

export interface ProjectDemandContractTemplateDto {
    documentUrl: string;
    fileType: 'pdf' | 'doc' | 'docx';
    documentType: 'pdf' | 'word';
    title: string;
    documentKey: string;
    callbackUrl?: string;
    token?: string;
}

export async function getProjectDemandContractTemplate(
    input: GetProjectDemandContractTemplateInput,
): Promise<ApiResponse<ProjectDemandContractTemplateDto>> {
    if (input.contractType !== '技术开发') {
        throw new Error('当前合同类型暂无可用模板');
    }

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
