<script setup lang="ts">
import { NButton, NCard, NSelect, NSpace } from 'naive-ui';
import type { ProjectDemandToolbarForm } from '../composables/useProjectDemandPage';

defineProps<{
    toolbarForm: ProjectDemandToolbarForm;
    workflowOptions: Array<{ label: string; value: string }>;
    yesNoOptions: Array<{ label: string; value: string }>;
    assigneeOptions: Array<{ label: string; value: string }>;
}>();

defineEmits<{
    'update:toolbar-field': [key: keyof ProjectDemandToolbarForm, value: string];
    submit: [];
    saveDraft: [];
    back: [];
    previewFlow: [];
}>();
</script>

<template>
    <NCard>
        <div class="flex flex-wrap items-end gap-4">
            <div class="w-[180px]">
                <p class="mb-2 text-sm text-[#4b5563]">是否为中标项目</p>
                <NSelect
                    :value="toolbarForm.isBidProject"
                    :options="yesNoOptions"
                    @update:value="$emit('update:toolbar-field', 'isBidProject', $event)"
                />
            </div>
            <div class="w-[220px]">
                <p class="mb-2 text-sm text-[#4b5563]">选择流程</p>
                <NSelect
                    :value="toolbarForm.workflow"
                    :options="workflowOptions"
                    @update:value="$emit('update:toolbar-field', 'workflow', $event)"
                />
            </div>
            <div class="w-[200px]">
                <p class="mb-2 text-sm text-[#4b5563]">办理人</p>
                <NSelect
                    :value="toolbarForm.assignee"
                    :options="assigneeOptions"
                    @update:value="$emit('update:toolbar-field', 'assignee', $event)"
                />
            </div>
            <div class="w-[180px]">
                <p class="mb-2 text-sm text-[#4b5563]">微信提醒</p>
                <NSelect
                    :value="toolbarForm.wechatNotify"
                    :options="yesNoOptions"
                    @update:value="$emit('update:toolbar-field', 'wechatNotify', $event)"
                />
            </div>
            <NSpace>
                <NButton type="primary" @click="$emit('submit')">提交</NButton>
                <NButton @click="$emit('saveDraft')">暂存</NButton>
                <NButton secondary @click="$emit('back')">返回</NButton>
                <NButton secondary @click="$emit('previewFlow')">查看流程</NButton>
            </NSpace>
        </div>
    </NCard>
</template>
