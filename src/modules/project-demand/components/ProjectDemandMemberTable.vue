<script setup lang="ts">
import { computed, h, reactive, watch } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NCard, NDataTable, NForm, NFormItem, NInput, NModal, NSelect } from 'naive-ui';
import type { ProjectDemandMemberRow } from '../composables/useProjectDemandPage';

const props = defineProps<{
    rows: ProjectDemandMemberRow[];
    dialogVisible: boolean;
    editingRow: ProjectDemandMemberRow | null;
    roleOptions: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits<{
    create: [];
    edit: [id: string];
    remove: [id: string];
    save: [payload: Partial<ProjectDemandMemberRow>];
    cancel: [];
}>();

const draft = reactive<Partial<ProjectDemandMemberRow>>({
    id: '',
    order: 1,
    name: '',
    employeeNo: '',
    phone: '',
    role: '',
});

watch(
    () => [props.dialogVisible, props.editingRow, props.rows.length],
    () => {
        if (props.editingRow) {
            Object.assign(draft, props.editingRow);
            return;
        }

        Object.assign(draft, {
            id: '',
            order: props.rows.length + 1,
            name: '',
            employeeNo: '',
            phone: '',
            role: '',
        });
    },
    { immediate: true },
);

const columns = computed<DataTableColumns<ProjectDemandMemberRow>>(() => [
    { title: '名次', key: 'order' },
    { title: '姓名', key: 'name' },
    { title: '工作证号', key: 'employeeNo' },
    { title: '电话', key: 'phone' },
    { title: '身份', key: 'role' },
    {
        title: '操作',
        key: 'actions',
        render: (row) =>
            h('div', { class: 'flex items-center gap-3' }, [
                h(
                    NButton,
                    {
                        text: true,
                        type: 'primary',
                        onClick: () => emit('edit', row.id),
                    },
                    { default: () => '修改' },
                ),
                h(
                    NButton,
                    {
                        text: true,
                        type: 'error',
                        onClick: () => emit('remove', row.id),
                    },
                    { default: () => '删除' },
                ),
            ]),
    },
]);

function handleSave() {
    emit('save', draft);
}
</script>

<template>
    <NCard>
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-[#22324d]">小组成员</h2>
            <NButton type="primary" secondary @click="$emit('create')">添加</NButton>
        </div>

        <NDataTable :columns="columns" :data="props.rows" :bordered="false" />

        <NModal :show="props.dialogVisible">
            <div class="w-[520px] rounded-sm bg-white p-5">
                <h3 class="mb-4 text-lg font-semibold text-[#22324d]">
                    {{ props.editingRow ? '修改成员' : '新增成员' }}
                </h3>

                <NForm label-placement="top">
                    <div class="grid gap-4 md:grid-cols-2">
                        <NFormItem label="名次">
                            <NInput v-model:value="draft.order" />
                        </NFormItem>
                        <NFormItem label="姓名">
                            <NInput v-model:value="draft.name" />
                        </NFormItem>
                        <NFormItem label="工作证号">
                            <NInput v-model:value="draft.employeeNo" />
                        </NFormItem>
                        <NFormItem label="电话">
                            <NInput v-model:value="draft.phone" />
                        </NFormItem>
                        <NFormItem class="md:col-span-2" label="身份">
                            <NSelect v-model:value="draft.role" :options="props.roleOptions" />
                        </NFormItem>
                    </div>
                </NForm>

                <div class="mt-5 flex justify-end gap-3">
                    <NButton @click="$emit('cancel')">取消</NButton>
                    <NButton type="primary" @click="handleSave">保存</NButton>
                </div>
            </div>
        </NModal>
    </NCard>
</template>
