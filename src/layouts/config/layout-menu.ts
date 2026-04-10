export interface LayoutMenuItem {
    key: string;
    label: string;
    path?: string;
    children?: LayoutMenuItem[];
}

export const layoutMenuItems: LayoutMenuItem[] = [
    {
        key: 'project-summary',
        label: '项目汇总',
        path: '/home',
    },
    {
        key: 'data-statistics',
        label: '数据统计',
        path: '/dashboard',
    },
    {
        key: 'project-management',
        label: '横向项目管理',
        children: [
            {
                key: 'horizontal-project',
                label: '横向项目',
                path: '/project-demand',
            },
        ],
    },
];
