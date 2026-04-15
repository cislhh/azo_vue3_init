import type { ApiResponse } from '../index';

export interface ProjectDemandStampResourceDto {
    imageUrl: string;
}

export async function getProjectDemandStampResource(): Promise<
    ApiResponse<ProjectDemandStampResourceDto>
> {
    return {
        code: 200,
        data: {
            imageUrl: '/z.png',
        },
        message: 'success',
    };
}
