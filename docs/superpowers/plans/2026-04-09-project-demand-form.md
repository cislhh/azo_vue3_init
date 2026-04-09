# 横向项目需求表单 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 `project-demand` 横向项目需求业务页，提供可访问路由入口、桌面端表单结构、本地校验和小组成员增删改。

**Architecture:** 采用 `pages + components + composables` 三层模块结构。页面 `src/modules/project-demand/pages/index.vue` 只负责组装，表单和成员状态统一收口到 `useProjectDemandPage.ts`，再通过 `props / emits` 分发到工具栏、主体表单和成员表格组件。

**Tech Stack:** Vue 3.5、TypeScript、Vue Router 文件路由、Naive UI、Tailwind CSS、Vitest。

---

## 文件结构

- Create: `src/modules/project-demand/pages/index.vue`
  - 文件路由入口页，挂载 `project-demand` 业务页。
- Create: `src/modules/project-demand/components/ProjectDemandToolbar.vue`
  - 顶部流程工具栏和按钮区。
- Create: `src/modules/project-demand/components/ProjectDemandForm.vue`
  - 主体字段区、备注区、合同模板区、附件区。
- Create: `src/modules/project-demand/components/ProjectDemandMemberTable.vue`
  - 小组成员表格和成员弹层表单。
- Create: `src/modules/project-demand/composables/useProjectDemandPage.ts`
  - 页面状态、校验、成员增删改、提交/暂存逻辑。
- Create: `src/modules/project-demand/composables/useProjectDemandPage.test.ts`
  - composable 行为测试。
- Create: `src/modules/project-demand/pages/index.test.ts`
  - 页面基础结构渲染测试。
- Modify: `src/modules/home/pages/index.vue`
  - 增加“横向项目”入口跳转到 `/project-demand`。
- Modify: `src/modules/home/pages/index.test.ts`
  - 校验首页出现“横向项目”入口。
- Modify: `src/layouts/config/layout-menu.ts`
  - 左侧导航“横向项目”从 `/home` 调整为 `/project-demand`。
- Modify: `src/layouts/components/LayoutSidebarMenu.test.ts`
  - 校验菜单配置的目标路径与高亮行为。

### Task 1: 搭建模块状态与测试基线

**Files:**
- Create: `src/modules/project-demand/composables/useProjectDemandPage.ts`
- Create: `src/modules/project-demand/composables/useProjectDemandPage.test.ts`

- [ ] **Step 1: 写出 composable 的失败测试**

```ts
import { describe, expect, it } from 'vitest';
import { useProjectDemandPage } from './useProjectDemandPage';

describe('useProjectDemandPage', () => {
    it('提供默认表单值、选项和示例成员', () => {
        const page = useProjectDemandPage();

        expect(page.toolbarForm.workflow).toBe('main-leader');
        expect(page.form.projectName).toBe('汽车底盘悬架控制臂轻量化设计与性能优化项目');
        expect(page.memberRows.value).toHaveLength(1);
        expect(page.memberRows.value[0]).toMatchObject({
            name: '测试人员',
            employeeNo: '000000',
            role: '项目负责人',
        });
        expect(page.workflowOptions.value.length).toBeGreaterThan(0);
        expect(page.departmentOptions.value.length).toBeGreaterThan(0);
    });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test src/modules/project-demand/composables/useProjectDemandPage.test.ts`
Expected: FAIL，提示找不到 `useProjectDemandPage` 或导入文件不存在。

- [ ] **Step 3: 写最小实现让测试通过**

```ts
import { computed, reactive, ref, shallowRef } from 'vue';

export interface ProjectDemandMemberRow {
    id: string;
    order: number;
    name: string;
    employeeNo: string;
    phone: string;
    role: string;
}

export function useProjectDemandPage() {
    const toolbarForm = reactive({
        isBidProject: 'no',
        workflow: 'main-leader',
        assignee: '',
        wechatNotify: 'yes',
    });

    const form = reactive({
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
    const contractTypeOptions = computed(() => [{ label: '技术开发', value: '技术开发' }]);
    const yesNoOptions = computed(() => [
        { label: '是', value: 'yes' },
        { label: '否', value: 'no' },
    ]);
    const assigneeOptions = computed(() => [{ label: '李佳', value: '李佳' }]);
    const messageState = shallowRef('');

    return {
        toolbarForm,
        form,
        memberRows,
        workflowOptions,
        departmentOptions,
        undertakingUnitOptions,
        principalUnitTypeOptions,
        provinceOptions,
        cityOptions,
        campusOptions,
        contractTypeOptions,
        yesNoOptions,
        assigneeOptions,
        messageState,
    };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test src/modules/project-demand/composables/useProjectDemandPage.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交阶段性变更**

```bash
git add src/modules/project-demand/composables/useProjectDemandPage.ts src/modules/project-demand/composables/useProjectDemandPage.test.ts
git commit -m "feat: 初始化横向项目表单状态"
```

### Task 2: 用 TDD 补齐提交、暂存与成员增删改逻辑

**Files:**
- Modify: `src/modules/project-demand/composables/useProjectDemandPage.ts`
- Modify: `src/modules/project-demand/composables/useProjectDemandPage.test.ts`

- [ ] **Step 1: 写失败测试覆盖校验和成员操作**

```ts
import { describe, expect, it } from 'vitest';
import { useProjectDemandPage } from './useProjectDemandPage';

describe('useProjectDemandPage actions', () => {
    it('提交时校验必填字段并返回错误信息', async () => {
        const page = useProjectDemandPage();
        page.form.projectName = '';
        page.form.startDate = '';

        const result = await page.submit();

        expect(result.ok).toBe(false);
        expect(result.errors.projectName).toBe('请输入项目名称');
        expect(result.errors.startDate).toBe('请选择开始时间');
    });

    it('暂存时允许未完成表单并记录消息', async () => {
        const page = useProjectDemandPage();
        page.form.projectName = '';

        const result = await page.saveDraft();

        expect(result.ok).toBe(true);
        expect(page.messageState.value).toBe('已暂存（模拟）');
    });

    it('支持新增、编辑、删除成员，并拦截重复工号', () => {
        const page = useProjectDemandPage();

        expect(page.upsertMember({ name: '', employeeNo: '', phone: '', role: '' }).ok).toBe(false);

        expect(
            page.upsertMember({
                name: '王悦',
                employeeNo: '100001',
                phone: '13800000000',
                role: '成员',
            }).ok,
        ).toBe(true);

        const created = page.memberRows.value.at(-1)!;

        expect(
            page.upsertMember({
                id: created.id,
                order: created.order,
                name: '王悦',
                employeeNo: '000000',
                phone: '13800000000',
                role: '成员',
            }).ok,
        ).toBe(false);

        expect(page.removeMember(created.id)).toBe(true);
        expect(page.memberRows.value.find((item) => item.id === created.id)).toBeUndefined();
    });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test src/modules/project-demand/composables/useProjectDemandPage.test.ts`
Expected: FAIL，提示缺少 `submit`、`saveDraft`、`upsertMember`、`removeMember`。

- [ ] **Step 3: 实现最小动作逻辑**

```ts
function createEmptyErrors() {
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

const formErrors = reactive(createEmptyErrors());

function validateForm() {
    Object.assign(formErrors, createEmptyErrors());

    if (!form.projectName.trim()) formErrors.projectName = '请输入项目名称';
    if (!form.startDate) formErrors.startDate = '请选择开始时间';
    if (!form.department) formErrors.department = '请选择所属单位';
    if (!form.principalUnit.trim()) formErrors.principalUnit = '请输入委托单位';
    if (!form.principalUnitType) formErrors.principalUnitType = '请选择委托单位类型';
    if (!form.province) formErrors.province = '请选择委托单位所在省';
    if (!form.city) formErrors.city = '请选择委托单位所在市';
    if (!form.middleNodeDate) formErrors.middleNodeDate = '请选择中期节点';
    if (!form.campus) formErrors.campus = '请选择校区';
    if (!form.contactPhone.trim()) formErrors.contactPhone = '请输入经办人联系电话';

    return Object.values(formErrors).every((item) => !item);
}

async function submit() {
    const ok = validateForm();
    if (!ok) {
        messageState.value = '提交失败，请检查必填项';
        return { ok: false, errors: { ...formErrors } };
    }

    messageState.value = '提交成功（模拟）';
    return { ok: true, errors: { ...formErrors } };
}

async function saveDraft() {
    messageState.value = '已暂存（模拟）';
    return { ok: true };
}

function upsertMember(input: Partial<ProjectDemandMemberRow>) {
    if (!input.name?.trim()) return { ok: false, message: '请输入姓名' };
    if (!input.employeeNo?.trim()) return { ok: false, message: '请输入工作证号' };
    if (!input.role?.trim()) return { ok: false, message: '请选择身份' };

    const duplicate = memberRows.value.find(
        (item) => item.employeeNo === input.employeeNo && item.id !== input.id,
    );
    if (duplicate) return { ok: false, message: '工作证号不能重复' };

    if (input.id) {
        memberRows.value = memberRows.value.map((item) =>
            item.id === input.id
                ? {
                      ...item,
                      ...input,
                      order: input.order ?? item.order,
                      phone: input.phone ?? '',
                  }
                : item,
        );
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
        },
    ];
    return { ok: true };
}

function removeMember(id: string) {
    const nextRows = memberRows.value.filter((item) => item.id !== id);
    if (nextRows.length === memberRows.value.length) return false;
    memberRows.value = nextRows;
    return true;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test src/modules/project-demand/composables/useProjectDemandPage.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交阶段性变更**

```bash
git add src/modules/project-demand/composables/useProjectDemandPage.ts src/modules/project-demand/composables/useProjectDemandPage.test.ts
git commit -m "feat: 完成横向项目表单交互逻辑"
```

### Task 3: 搭建页面组件与路由文件

**Files:**
- Create: `src/modules/project-demand/pages/index.vue`
- Create: `src/modules/project-demand/components/ProjectDemandToolbar.vue`
- Create: `src/modules/project-demand/components/ProjectDemandForm.vue`
- Create: `src/modules/project-demand/components/ProjectDemandMemberTable.vue`
- Create: `src/modules/project-demand/pages/index.test.ts`

- [ ] **Step 1: 写页面失败测试**

```ts
import { createPinia, setActivePinia } from 'pinia';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { beforeEach, describe, expect, it } from 'vitest';
import ProjectDemandPage from './index.vue';

let activePinia = createPinia();

async function renderProjectDemandPage() {
    const app = createSSRApp(ProjectDemandPage);
    app.use(activePinia);
    app.config.globalProperties.$route = { path: '/project-demand', name: '/project-demand/' } as never;
    return renderToString(app);
}

describe('project demand page', () => {
    beforeEach(() => {
        activePinia = createPinia();
        setActivePinia(activePinia);
    });

    it('渲染横向项目需求页关键区域', async () => {
        const html = await renderProjectDemandPage();
        expect(html).toContain('横向项目需求');
        expect(html).toContain('是否为中标项目');
        expect(html).toContain('项目名称');
        expect(html).toContain('小组成员');
    });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test src/modules/project-demand/pages/index.test.ts`
Expected: FAIL，提示页面文件不存在。

- [ ] **Step 3: 实现最小页面与组件结构**

```vue
<!-- src/modules/project-demand/pages/index.vue -->
<script setup lang="ts">
import ProjectDemandForm from '../components/ProjectDemandForm.vue';
import ProjectDemandMemberTable from '../components/ProjectDemandMemberTable.vue';
import ProjectDemandToolbar from '../components/ProjectDemandToolbar.vue';
import { useProjectDemandPage } from '../composables/useProjectDemandPage';

const page = useProjectDemandPage();
</script>

<template>
    <div class="space-y-6">
        <header class="rounded-sm bg-white p-5 shadow-sm">
            <h1 class="text-[clamp(24px,2vw,30px)] font-semibold text-[#22324d]">横向项目需求</h1>
            <p class="mt-2 text-sm text-[#6b7280]">按业务流程填写项目基础信息、合同信息和成员信息。</p>
        </header>

        <ProjectDemandToolbar
            :toolbar-form="page.toolbarForm"
            :workflow-options="page.workflowOptions"
            :yes-no-options="page.yesNoOptions"
            :assignee-options="page.assigneeOptions"
            @submit="page.submit"
            @save-draft="page.saveDraft"
        />

        <ProjectDemandForm
            :form="page.form"
            :form-errors="page.formErrors"
            :contract-type-options="page.contractTypeOptions"
            :department-options="page.departmentOptions"
            :undertaking-unit-options="page.undertakingUnitOptions"
            :principal-unit-type-options="page.principalUnitTypeOptions"
            :province-options="page.provinceOptions"
            :city-options="page.cityOptions"
            :campus-options="page.campusOptions"
            :yes-no-options="page.yesNoOptions"
        />

        <ProjectDemandMemberTable :rows="page.memberRows" />
    </div>
</template>
```

```vue
<!-- src/modules/project-demand/components/ProjectDemandToolbar.vue -->
<script setup lang="ts">
import { NButton, NCard, NSelect, NSpace } from 'naive-ui';

defineProps<{
    toolbarForm: Record<string, string>;
    workflowOptions: Array<{ label: string; value: string }>;
    yesNoOptions: Array<{ label: string; value: string }>;
    assigneeOptions: Array<{ label: string; value: string }>;
}>();

defineEmits<{ submit: []; saveDraft: [] }>();
</script>

<template>
    <NCard>
        <div class="flex flex-wrap items-end gap-4">
            <div class="w-[180px]">
                <p class="mb-2 text-sm text-[#4b5563]">是否为中标项目</p>
                <NSelect :value="toolbarForm.isBidProject" :options="yesNoOptions" />
            </div>
            <div class="w-[220px]">
                <p class="mb-2 text-sm text-[#4b5563]">选择流程</p>
                <NSelect :value="toolbarForm.workflow" :options="workflowOptions" />
            </div>
            <div class="w-[200px]">
                <p class="mb-2 text-sm text-[#4b5563]">办理人</p>
                <NSelect :value="toolbarForm.assignee" :options="assigneeOptions" />
            </div>
            <div class="w-[180px]">
                <p class="mb-2 text-sm text-[#4b5563]">微信提醒</p>
                <NSelect :value="toolbarForm.wechatNotify" :options="yesNoOptions" />
            </div>
            <NSpace>
                <NButton type="primary" @click="$emit('submit')">提交</NButton>
                <NButton @click="$emit('save-draft')">暂存</NButton>
                <NButton secondary>返回</NButton>
                <NButton secondary>查看流程</NButton>
            </NSpace>
        </div>
    </NCard>
</template>
```

```vue
<!-- src/modules/project-demand/components/ProjectDemandForm.vue -->
<script setup lang="ts">
import { NCard, NDatePicker, NInput, NSelect } from 'naive-ui';

defineProps<{
    form: Record<string, string>;
    formErrors: Record<string, string>;
    contractTypeOptions: Array<{ label: string; value: string }>;
    departmentOptions: Array<{ label: string; value: string }>;
    undertakingUnitOptions: Array<{ label: string; value: string }>;
    principalUnitTypeOptions: Array<{ label: string; value: string }>;
    provinceOptions: Array<{ label: string; value: string }>;
    cityOptions: Array<{ label: string; value: string }>;
    campusOptions: Array<{ label: string; value: string }>;
    yesNoOptions: Array<{ label: string; value: string }>;
}>();
</script>

<template>
    <NCard>
        <div class="grid gap-4 xl:grid-cols-2">
            <div>
                <p class="mb-2 text-sm font-medium text-[#374151]">项目名称</p>
                <NInput :value="form.projectName" />
                <p v-if="formErrors.projectName" class="mt-1 text-xs text-[#d03050]">{{ formErrors.projectName }}</p>
            </div>
            <div>
                <p class="mb-2 text-sm font-medium text-[#374151]">开始时间</p>
                <NDatePicker type="date" clearable />
                <p v-if="formErrors.startDate" class="mt-1 text-xs text-[#d03050]">{{ formErrors.startDate }}</p>
            </div>
            <div class="xl:col-span-2">
                <p class="mb-2 text-sm font-medium text-[#374151]">备注</p>
                <NInput type="textarea" :value="form.remark" :rows="5" />
            </div>
        </div>
    </NCard>
</template>
```

```vue
<!-- src/modules/project-demand/components/ProjectDemandMemberTable.vue -->
<script setup lang="ts">
import { NButton, NCard, NDataTable } from 'naive-ui';
import { computed } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import type { ProjectDemandMemberRow } from '../composables/useProjectDemandPage';

const props = defineProps<{ rows: ProjectDemandMemberRow[] }>();

const columns = computed<DataTableColumns<ProjectDemandMemberRow>>(() => [
    { title: '名次', key: 'order' },
    { title: '姓名', key: 'name' },
    { title: '工作证号', key: 'employeeNo' },
    { title: '电话', key: 'phone' },
    { title: '身份', key: 'role' },
    { title: '操作', key: 'actions' },
]);
</script>

<template>
    <NCard>
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-[#22324d]">小组成员</h2>
            <NButton type="primary" secondary>添加</NButton>
        </div>
        <NDataTable :columns="columns" :data="props.rows" :bordered="false" />
    </NCard>
</template>
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test src/modules/project-demand/pages/index.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交阶段性变更**

```bash
git add src/modules/project-demand/pages/index.vue src/modules/project-demand/pages/index.test.ts src/modules/project-demand/components/ProjectDemandToolbar.vue src/modules/project-demand/components/ProjectDemandForm.vue src/modules/project-demand/components/ProjectDemandMemberTable.vue
git commit -m "feat: 搭建横向项目需求页面骨架"
```

### Task 4: 连接组件通信并完成桌面端表单布局

**Files:**
- Modify: `src/modules/project-demand/pages/index.vue`
- Modify: `src/modules/project-demand/components/ProjectDemandToolbar.vue`
- Modify: `src/modules/project-demand/components/ProjectDemandForm.vue`
- Modify: `src/modules/project-demand/components/ProjectDemandMemberTable.vue`
- Modify: `src/modules/project-demand/composables/useProjectDemandPage.ts`

- [ ] **Step 1: 写出失败测试验证页面能显示更多关键字段和错误提示**

```ts
it('渲染合同、单位和附件相关字段', async () => {
    const html = await renderProjectDemandPage();

    expect(html).toContain('合同类型');
    expect(html).toContain('所属单位');
    expect(html).toContain('委托单位');
    expect(html).toContain('非标合同或附件');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test src/modules/project-demand/pages/index.test.ts`
Expected: FAIL，缺少字段标签。

- [ ] **Step 3: 实现完整 props / emits 通信和桌面端布局**

```ts
// useProjectDemandPage.ts 返回中增加字段更新方法
function updateToolbarField<Key extends keyof typeof toolbarForm>(key: Key, value: (typeof toolbarForm)[Key]) {
    toolbarForm[key] = value;
}

function updateFormField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    form[key] = value;
}

return {
    ...,
    formErrors,
    updateToolbarField,
    updateFormField,
    submit,
    saveDraft,
    upsertMember,
    removeMember,
};
```

```vue
<!-- ProjectDemandToolbar.vue 中增加 v-model 式更新 -->
<script setup lang="ts">
const emit = defineEmits<{
    'update:toolbar-field': [key: string, value: string];
    submit: [];
    saveDraft: [];
    back: [];
    preview-flow: [];
}>();
</script>

<NSelect
    :value="toolbarForm.workflow"
    :options="workflowOptions"
    @update:value="emit('update:toolbar-field', 'workflow', $event)"
/>
```

```vue
<!-- ProjectDemandForm.vue 中补齐字段网格 -->
<template>
    <NCard>
        <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div class="grid gap-4">
                <FormField label="项目名称" :error="formErrors.projectName" required>
                    <NInput :value="form.projectName" @update:value="$emit('update:form-field', 'projectName', $event)" />
                </FormField>
                <FormField label="申请时间">
                    <NInput :value="form.applicationTime" readonly />
                </FormField>
                <FormField label="合同类型">
                    <NSelect :value="form.contractType" :options="contractTypeOptions" @update:value="$emit('update:form-field', 'contractType', $event)" />
                </FormField>
                <FormField label="所属单位" :error="formErrors.department" required>
                    <NSelect :value="form.department" :options="departmentOptions" @update:value="$emit('update:form-field', 'department', $event)" />
                </FormField>
            </div>

            <div class="grid gap-4">
                <FormField label="委托单位" :error="formErrors.principalUnit" required>
                    <NInput :value="form.principalUnit" @update:value="$emit('update:form-field', 'principalUnit', $event)" />
                </FormField>
                <FormField label="委托单位单位类型" :error="formErrors.principalUnitType" required>
                    <NSelect :value="form.principalUnitType" :options="principalUnitTypeOptions" @update:value="$emit('update:form-field', 'principalUnitType', $event)" />
                </FormField>
                <FormField label="委托单位所在省" :error="formErrors.province" required>
                    <NSelect :value="form.province" :options="provinceOptions" @update:value="$emit('update:form-field', 'province', $event)" />
                </FormField>
                <FormField label="委托单位所在市" :error="formErrors.city" required>
                    <NSelect :value="form.city" :options="cityOptions" @update:value="$emit('update:form-field', 'city', $event)" />
                </FormField>
            </div>

            <div class="xl:col-span-2 grid gap-4">
                <FormField label="备注">
                    <NInput type="textarea" :value="form.remark" :rows="5" @update:value="$emit('update:form-field', 'remark', $event)" />
                </FormField>
                <FormField label="合同模板">
                    <div class="flex items-center gap-3">
                        <NButton secondary>编辑合同</NButton>
                        <NButton secondary>重置模板</NButton>
                        <NSelect class="w-[180px]" :value="form.needElectronicSeal" :options="yesNoOptions" @update:value="$emit('update:form-field', 'needElectronicSeal', $event)" />
                    </div>
                </FormField>
                <FormField label="非标合同或附件">
                    <div class="flex items-center gap-3">
                        <NInput :value="form.attachmentName" placeholder="暂未上传附件" />
                        <NButton secondary>上传附件</NButton>
                    </div>
                </FormField>
            </div>
        </div>
    </NCard>
</template>
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test src/modules/project-demand/pages/index.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交阶段性变更**

```bash
git add src/modules/project-demand/pages/index.vue src/modules/project-demand/components/ProjectDemandToolbar.vue src/modules/project-demand/components/ProjectDemandForm.vue src/modules/project-demand/components/ProjectDemandMemberTable.vue src/modules/project-demand/composables/useProjectDemandPage.ts src/modules/project-demand/pages/index.test.ts
git commit -m "feat: 完善横向项目表单布局与通信"
```

### Task 5: 接入成员弹层编辑与操作反馈

**Files:**
- Modify: `src/modules/project-demand/components/ProjectDemandMemberTable.vue`
- Modify: `src/modules/project-demand/pages/index.vue`
- Modify: `src/modules/project-demand/composables/useProjectDemandPage.ts`
- Modify: `src/modules/project-demand/pages/index.test.ts`

- [ ] **Step 1: 写失败测试验证成员区渲染操作入口**

```ts
it('渲染成员区添加和修改操作', async () => {
    const html = await renderProjectDemandPage();

    expect(html).toContain('添加');
    expect(html).toContain('修改');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test src/modules/project-demand/pages/index.test.ts`
Expected: FAIL，表格操作列没有输出“修改”。

- [ ] **Step 3: 实现成员弹层和操作事件**

```ts
// useProjectDemandPage.ts
const editingMember = shallowRef<ProjectDemandMemberRow | null>(null);
const memberDialogVisible = shallowRef(false);

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
```

```vue
<!-- ProjectDemandMemberTable.vue -->
<script setup lang="ts">
import { h, reactive, watch } from 'vue';
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, NPopconfirm, NSelect } from 'naive-ui';

const emit = defineEmits<{
    create: [];
    edit: [id: string];
    remove: [id: string];
    save: [payload: { id?: string; order?: number; name: string; employeeNo: string; phone: string; role: string }];
    cancel: [];
}>();

const draft = reactive({ id: '', order: 0, name: '', employeeNo: '', phone: '', role: '' });

watch(
    () => props.editingRow,
    (value) => {
        Object.assign(draft, value ?? { id: '', order: props.rows.length + 1, name: '', employeeNo: '', phone: '', role: '' });
    },
    { immediate: true },
);

const columns = computed<DataTableColumns<ProjectDemandMemberRow>>(() => [
    ...,
    {
        title: '操作',
        key: 'actions',
        render: (row) =>
            h('div', { class: 'flex items-center gap-3' }, [
                h(NButton, { text: true, type: 'primary', onClick: () => emit('edit', row.id) }, { default: () => '修改' }),
                h(NPopconfirm, { onPositiveClick: () => emit('remove', row.id) }, {
                    trigger: () => h(NButton, { text: true, type: 'error' }, { default: () => '删除' }),
                    default: () => '确认删除该成员吗？',
                }),
            ]),
    },
]);
</script>
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test src/modules/project-demand/pages/index.test.ts src/modules/project-demand/composables/useProjectDemandPage.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交阶段性变更**

```bash
git add src/modules/project-demand/components/ProjectDemandMemberTable.vue src/modules/project-demand/pages/index.vue src/modules/project-demand/composables/useProjectDemandPage.ts src/modules/project-demand/pages/index.test.ts
git commit -m "feat: 完成横向项目成员维护交互"
```

### Task 6: 补齐业务入口跳转与导航验证

**Files:**
- Modify: `src/modules/home/pages/index.vue`
- Modify: `src/modules/home/pages/index.test.ts`
- Modify: `src/layouts/config/layout-menu.ts`
- Modify: `src/layouts/components/LayoutSidebarMenu.test.ts`

- [ ] **Step 1: 写失败测试覆盖首页和左侧菜单入口**

```ts
it('渲染横向项目入口并指向业务路由', async () => {
    const html = await renderHomePage();

    expect(html).toContain('横向项目');
    expect(html).toContain('/project-demand');
});
```

```ts
const menuItems: LayoutMenuItem[] = [
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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm test src/modules/home/pages/index.test.ts src/layouts/components/LayoutSidebarMenu.test.ts`
Expected: FAIL，首页和菜单仍指向 `/home`。

- [ ] **Step 3: 修改入口与路由链接**

```ts
// src/layouts/config/layout-menu.ts
export const layoutMenuItems: LayoutMenuItem[] = [
    { key: 'project-summary', label: '项目汇总', path: '/home' },
    { key: 'data-statistics', label: '数据统计', path: '/dashboard' },
    {
        key: 'project-management',
        label: '横向项目管理',
        children: [{ key: 'horizontal-project', label: '横向项目', path: '/project-demand' }],
    },
];
```

```vue
<!-- src/modules/home/pages/index.vue 在数据概览或待办附近增加入口卡片 -->
<RouterLink
    to="/project-demand"
    class="inline-flex items-center rounded-lg bg-[#2f67ff] px-4 py-2 text-sm font-medium text-white"
>
    横向项目
</RouterLink>
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm test src/modules/home/pages/index.test.ts src/layouts/components/LayoutSidebarMenu.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交阶段性变更**

```bash
git add src/modules/home/pages/index.vue src/modules/home/pages/index.test.ts src/layouts/config/layout-menu.ts src/layouts/components/LayoutSidebarMenu.test.ts
git commit -m "feat: 补充横向项目业务入口"
```

### Task 7: 全量验证与收尾

**Files:**
- Verify only: `src/modules/project-demand/**`
- Verify only: `src/modules/home/pages/index.vue`
- Verify only: `src/layouts/config/layout-menu.ts`

- [ ] **Step 1: 运行模块相关测试**

Run: `pnpm test src/modules/project-demand/composables/useProjectDemandPage.test.ts src/modules/project-demand/pages/index.test.ts src/modules/home/pages/index.test.ts src/layouts/components/LayoutSidebarMenu.test.ts`
Expected: PASS。

- [ ] **Step 2: 运行类型检查**

Run: `pnpm type-check`
Expected: PASS。

- [ ] **Step 3: 运行完整检查**

Run: `pnpm check`
Expected: PASS。

- [ ] **Step 4: 人工核对关键体验**

Run: `pnpm dev`
Expected: 在浏览器访问 `/project-demand`，确认以下内容：

```text
1. 首页与左侧菜单都能进入 /project-demand
2. 顶部工具栏按钮和选择器对齐稳定
3. 主体字段区为桌面端优先布局，字号层级清晰
4. 提交时必填错误文案可见
5. 暂存可直接提示成功
6. 小组成员支持添加、修改、删除
```

- [ ] **Step 5: 提交最终变更**

```bash
git add src/modules/project-demand src/modules/home/pages/index.vue src/modules/home/pages/index.test.ts src/layouts/config/layout-menu.ts src/layouts/components/LayoutSidebarMenu.test.ts
git commit -m "feat: 完成横向项目需求表单页面"
```
