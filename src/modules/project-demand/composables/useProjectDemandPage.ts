import { api } from '@/core/http/api';
import type { OnlyOfficeDocumentConfig } from '@/components/onlyoffice';
import { resolveOnlyOfficeDocumentUrl } from '@/components/onlyoffice/file-access';
import type { ProjectDemandContractTemplateDto } from '@/core/http/project-demand/get-contract-template';
import { computed, reactive, ref, shallowRef } from 'vue';

export interface ProjectDemandMemberRow {
    id: string;
    order: number;
    name: string;
    employeeNo: string;
    phone: string;
    role: string;
}

export interface ProjectDemandToolbarForm {
    isBidProject: string;
    workflow: string;
    assignee: string;
    wechatNotify: string;
}

export interface ProjectDemandFormModel {
    projectName: string;
    applicationTime: string;
    startDate: string;
    contractType: string;
    endDate: string;
    contractNo: string;
    contractAmount: string;
    expenseAmount: string;
    campusCode: string;
    department: string;
    undertakingUnit: string;
    principalUnit: string;
    principalUnitType: string;
    acceptanceDate: string;
    province: string;
    city: string;
    middleNodeDate: string;
    totalAmount: string;
    contactPhone: string;
    campus: string;
    remark: string;
    contractTemplate: string;
    needElectronicSeal: string;
    attachmentName: string;
}

interface SubmitResult {
    ok: boolean;
    errors: ProjectDemandFormErrors;
}

interface DraftResult {
    ok: boolean;
}

interface MemberActionResult {
    ok: boolean;
    message?: string;
}

interface ProjectDemandFormErrors {
    projectName: string;
    startDate: string;
    department: string;
    principalUnit: string;
    principalUnitType: string;
    province: string;
    city: string;
    middleNodeDate: string;
    campus: string;
    contactPhone: string;
}

const SUPPORTED_CONTRACT_TEMPLATE_FILE_TYPES = new Set<
    ProjectDemandContractTemplateDto['fileType']
>(['pdf', 'doc', 'docx', 'xlsx']);

function createEmptyErrors(): ProjectDemandFormErrors {
    return {
        projectName: '',
        startDate: '',
        department: '',
        principalUnit: '',
        principalUnitType: '',
        province: '',
        city: '',
        middleNodeDate: '',
        campus: '',
        contactPhone: '',
    };
}

function mapContractTemplateToEditorConfig(
    template: ProjectDemandContractTemplateDto,
    documentUrl: string,
    revisedFile?: {
        fileType: 'docx';
        token?: string;
        url: string;
    },
    stampImageUrl?: string,
): OnlyOfficeDocumentConfig {
    return {
        document: {
            fileType: template.fileType,
            key: template.documentKey,
            title: template.title,
            url: documentUrl,
        },
        documentType: template.documentType,
        editorConfig: {
            callbackUrl: template.callbackUrl,
            revisedFile,
            stampImageUrl,
        },
    };
}

export function useProjectDemandPage() {
    const globalScope = globalThis as typeof globalThis & {
        __ONLYOFFICE_DEV_ACCESS_HOST__?: string;
    };
    const toolbarForm = reactive<ProjectDemandToolbarForm>({
        isBidProject: 'no',
        workflow: 'main-leader',
        assignee: '',
        wechatNotify: 'yes',
    });

    const form = reactive<ProjectDemandFormModel>({
        projectName: '汽车底盘悬架控制臂轻量化设计与性能优化项目',
        applicationTime: '2026-04-09 09:00:00',
        startDate: '2026-04-09',
        contractType: '',
        endDate: '2026-12-31',
        contractNo: '',
        contractAmount: '',
        expenseAmount: '',
        campusCode: '',
        department: '数学学院',
        undertakingUnit: '吉林大学',
        principalUnit: '',
        principalUnitType: '政府',
        acceptanceDate: '2026-12-31',
        province: '',
        city: '',
        middleNodeDate: '2026-09-30',
        totalAmount: '',
        contactPhone: '',
        campus: '',
        remark: '',
        contractTemplate: '',
        needElectronicSeal: 'no',
        attachmentName: '',
    });

    const memberRows = ref<ProjectDemandMemberRow[]>([
        {
            id: 'member-1',
            order: 1,
            name: '测试人员',
            employeeNo: '000000',
            phone: '',
            role: '项目负责人',
        },
    ]);

    const workflowOptions = computed(() => [{ label: '主管领导', value: 'main-leader' }]);
    const departmentOptions = computed(() => [{ label: '数学学院', value: '数学学院' }]);
    const undertakingUnitOptions = computed(() => [{ label: '吉林大学', value: '吉林大学' }]);
    const principalUnitTypeOptions = computed(() => [{ label: '政府', value: '政府' }]);
    const provinceOptions = computed(() => [{ label: '吉林省', value: '吉林省' }]);
    const cityOptions = computed(() => [{ label: '长春市', value: '长春市' }]);
    const campusOptions = computed(() => [{ label: '中心校区', value: '中心校区' }]);
    const contractTypeOptions = computed(() => [
        { label: '技术开发', value: '技术开发' },
        { label: '产品需求', value: '产品需求' },
        { label: '接口文档', value: '接口文档' },
    ]);
    const memberRoleOptions = computed(() => [
        { label: '项目负责人', value: '项目负责人' },
        { label: '成员', value: '成员' },
    ]);
    const yesNoOptions = computed(() => [
        { label: '是', value: 'yes' },
        { label: '否', value: 'no' },
    ]);
    const assigneeOptions = computed(() => [{ label: '李佳', value: '李佳' }]);
    const messageState = shallowRef('');
    const documentServerUrl = computed(
        () =>
            import.meta.env.VITE_ONLYOFFICE_URL?.trim() ??
            import.meta.env.VITE_ONLYOFFICE_DOCUMENT_SERVER_URL?.trim() ??
            '',
    );
    const fileAccessHost = computed(() => import.meta.env.VITE_FILE_ACCESS_HOST?.trim() ?? '');
    const devAccessHost = computed(() => globalScope.__ONLYOFFICE_DEV_ACCESS_HOST__ ?? '');
    const formErrors = reactive(createEmptyErrors());
    const memberDialogVisible = shallowRef(false);
    const editingMember = shallowRef<ProjectDemandMemberRow | null>(null);
    const contractEditorVisible = shallowRef(false);
    const contractEditorLoading = shallowRef(false);
    const contractEditorConfig = shallowRef<OnlyOfficeDocumentConfig | null>(null);

    function validateForm() {
        Object.assign(formErrors, createEmptyErrors());

        if (!form.projectName.trim()) {
            formErrors.projectName = '请输入项目名称';
        }

        if (!form.startDate) {
            formErrors.startDate = '请选择开始时间';
        }

        if (!form.department) {
            formErrors.department = '请选择所属单位';
        }

        if (!form.principalUnit.trim()) {
            formErrors.principalUnit = '请输入委托单位';
        }

        if (!form.principalUnitType) {
            formErrors.principalUnitType = '请选择委托单位类型';
        }

        if (!form.province) {
            formErrors.province = '请选择委托单位所在省';
        }

        if (!form.city) {
            formErrors.city = '请选择委托单位所在市';
        }

        if (!form.middleNodeDate) {
            formErrors.middleNodeDate = '请选择中期节点';
        }

        if (!form.campus) {
            formErrors.campus = '请选择校区';
        }

        if (!form.contactPhone.trim()) {
            formErrors.contactPhone = '请输入经办人联系电话';
        }

        return Object.values(formErrors).every((item) => !item);
    }

    async function submit(): Promise<SubmitResult> {
        if (!validateForm()) {
            messageState.value = '提交失败，请检查必填项';
            return {
                ok: false,
                errors: { ...formErrors },
            };
        }

        messageState.value = '提交成功（模拟）';
        return {
            ok: true,
            errors: { ...formErrors },
        };
    }

    async function saveDraft(): Promise<DraftResult> {
        messageState.value = '已暂存（模拟）';
        return { ok: true };
    }

    async function openContractEditor() {
        if (!form.contractType) {
            messageState.value = '请先选择合同类型';
            return;
        }

        if (!documentServerUrl.value) {
            messageState.value = 'OnlyOffice 服务地址未配置';
            return;
        }

        contractEditorLoading.value = true;

        try {
            const response = await api.projectDemand.getContractTemplate({
                contractType: form.contractType,
            });
            const template = response.data;

            if (!template.documentUrl) {
                throw new Error('未获取到合同模板地址');
            }

            if (!SUPPORTED_CONTRACT_TEMPLATE_FILE_TYPES.has(template.fileType)) {
                throw new Error('当前合同模板格式不支持在线编辑/预览');
            }

            const documentAccessUrl = resolveOnlyOfficeDocumentUrl({
                currentOrigin: globalThis.location?.origin,
                devAccessHost: devAccessHost.value,
                documentUrl: template.documentUrl,
                fileAccessHost: fileAccessHost.value,
            });
            const revisedFile =
                template.documentType === 'word'
                    ? {
                          fileType: 'docx' as const,
                          url: resolveOnlyOfficeDocumentUrl({
                              currentOrigin: globalThis.location?.origin,
                              devAccessHost: devAccessHost.value,
                              documentUrl: '/old.docx',
                              fileAccessHost: fileAccessHost.value,
                          }),
                      }
                    : undefined;

            const stampImageUrl =
                template.documentType === 'word'
                    ? (await api.projectDemand.getStampResource()).data.imageUrl
                    : undefined;

            contractEditorConfig.value = mapContractTemplateToEditorConfig(
                template,
                documentAccessUrl,
                revisedFile,
                stampImageUrl,
            );
            contractEditorVisible.value = true;
        } catch (error) {
            messageState.value =
                error instanceof Error ? error.message : '打开合同模板失败，请稍后重试';
        } finally {
            contractEditorLoading.value = false;
        }
    }

    function closeContractEditor() {
        contractEditorVisible.value = false;
        contractEditorConfig.value = null;
    }

    function upsertMember(input: Partial<ProjectDemandMemberRow>): MemberActionResult {
        if (!input.name?.trim()) {
            return { ok: false, message: '请输入姓名' };
        }

        if (!input.employeeNo?.trim()) {
            return { ok: false, message: '请输入工作证号' };
        }

        if (!input.role?.trim()) {
            return { ok: false, message: '请选择身份' };
        }

        const duplicate = memberRows.value.find(
            (item) => item.employeeNo === input.employeeNo && item.id !== input.id,
        );
        if (duplicate) {
            return { ok: false, message: '工作证号不能重复' };
        }

        if (input.id) {
            memberRows.value = memberRows.value.map((item) => {
                if (item.id !== input.id) {
                    return item;
                }

                return {
                    ...item,
                    ...input,
                    order: input.order ?? item.order,
                    phone: input.phone ?? '',
                } as ProjectDemandMemberRow;
            });

            return { ok: true };
        }

        memberRows.value = [
            ...memberRows.value,
            {
                id: `member-${Date.now()}`,
                order: input.order ?? memberRows.value.length + 1,
                name: input.name,
                employeeNo: input.employeeNo,
                phone: input.phone ?? '',
                role: input.role,
            } as ProjectDemandMemberRow,
        ];

        return { ok: true };
    }

    function removeMember(id: string) {
        const nextRows = memberRows.value.filter((item) => item.id !== id);
        if (nextRows.length === memberRows.value.length) {
            return false;
        }

        memberRows.value = nextRows;
        messageState.value = '成员已删除';
        return true;
    }

    function openCreateMemberDialog() {
        editingMember.value = null;
        memberDialogVisible.value = true;
    }

    function openEditMemberDialog(id: string) {
        editingMember.value = memberRows.value.find((item) => item.id === id) ?? null;
        memberDialogVisible.value = true;
    }

    function closeMemberDialog() {
        editingMember.value = null;
        memberDialogVisible.value = false;
    }

    function saveMember(input: Partial<ProjectDemandMemberRow>) {
        const result = upsertMember(input);
        if (result.ok) {
            memberDialogVisible.value = false;
            editingMember.value = null;
            messageState.value = input.id ? '成员已更新' : '成员已添加';
        }

        return result;
    }

    function updateToolbarField<Key extends keyof ProjectDemandToolbarForm>(
        key: Key,
        value: ProjectDemandToolbarForm[Key],
    ) {
        toolbarForm[key] = value;
    }

    function updateFormField<Key extends keyof ProjectDemandFormModel>(
        key: Key,
        value: ProjectDemandFormModel[Key],
    ) {
        form[key] = value;
    }

    return {
        toolbarForm,
        form,
        formErrors,
        memberRows,
        workflowOptions,
        departmentOptions,
        undertakingUnitOptions,
        principalUnitTypeOptions,
        provinceOptions,
        cityOptions,
        campusOptions,
        contractTypeOptions,
        memberRoleOptions,
        yesNoOptions,
        assigneeOptions,
        messageState,
        documentServerUrl,
        memberDialogVisible,
        editingMember,
        contractEditorVisible,
        contractEditorLoading,
        contractEditorConfig,
        submit,
        saveDraft,
        openContractEditor,
        closeContractEditor,
        upsertMember,
        removeMember,
        openCreateMemberDialog,
        openEditMemberDialog,
        closeMemberDialog,
        saveMember,
        updateToolbarField,
        updateFormField,
    };
}
