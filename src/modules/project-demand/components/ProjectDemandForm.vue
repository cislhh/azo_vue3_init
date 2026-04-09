<script setup lang="ts">
import { NButton, NCard, NInput, NSelect } from 'naive-ui';
import type { ProjectDemandFormModel } from '../composables/useProjectDemandPage';

defineProps<{
    form: ProjectDemandFormModel;
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

defineEmits<{
    'update:form-field': [key: keyof ProjectDemandFormModel, value: string];
}>();
</script>

<template>
    <NCard>
        <div class="grid gap-5 xl:grid-cols-2">
            <div class="grid gap-4">
                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">项目名称</p>
                    <NInput
                        :value="form.projectName"
                        @update:value="$emit('update:form-field', 'projectName', $event)"
                    />
                    <p v-if="formErrors.projectName" class="mt-1 text-xs text-[#d03050]">
                        {{ formErrors.projectName }}
                    </p>
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">申请时间</p>
                    <NInput :value="form.applicationTime" readonly />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">合同类型</p>
                    <NSelect
                        :value="form.contractType"
                        :options="contractTypeOptions"
                        @update:value="$emit('update:form-field', 'contractType', $event ?? '')"
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">开始时间</p>
                    <NInput
                        :value="form.startDate"
                        @update:value="$emit('update:form-field', 'startDate', $event)"
                    />
                    <p v-if="formErrors.startDate" class="mt-1 text-xs text-[#d03050]">
                        {{ formErrors.startDate }}
                    </p>
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">所属单位</p>
                    <NSelect
                        :value="form.department"
                        :options="departmentOptions"
                        @update:value="$emit('update:form-field', 'department', $event ?? '')"
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">承担单位</p>
                    <NSelect
                        :value="form.undertakingUnit"
                        :options="undertakingUnitOptions"
                        @update:value="$emit('update:form-field', 'undertakingUnit', $event ?? '')"
                    />
                </div>
            </div>

            <div class="grid gap-4">
                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">委托单位</p>
                    <NInput
                        :value="form.principalUnit"
                        @update:value="$emit('update:form-field', 'principalUnit', $event)"
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">委托单位单位类型</p>
                    <NSelect
                        :value="form.principalUnitType"
                        :options="principalUnitTypeOptions"
                        @update:value="
                            $emit('update:form-field', 'principalUnitType', $event ?? '')
                        "
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">委托单位所在省</p>
                    <NSelect
                        :value="form.province"
                        :options="provinceOptions"
                        @update:value="$emit('update:form-field', 'province', $event ?? '')"
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">委托单位所在市</p>
                    <NSelect
                        :value="form.city"
                        :options="cityOptions"
                        @update:value="$emit('update:form-field', 'city', $event ?? '')"
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">中期节点</p>
                    <NInput
                        :value="form.middleNodeDate"
                        @update:value="$emit('update:form-field', 'middleNodeDate', $event)"
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">校区</p>
                    <NSelect
                        :value="form.campus"
                        :options="campusOptions"
                        @update:value="$emit('update:form-field', 'campus', $event ?? '')"
                    />
                </div>

                <div>
                    <p class="mb-2 text-sm font-medium text-[#374151]">经办人联系电话</p>
                    <NInput
                        :value="form.contactPhone"
                        @update:value="$emit('update:form-field', 'contactPhone', $event)"
                    />
                </div>
            </div>

            <div class="xl:col-span-2">
                <p class="mb-2 text-sm font-medium text-[#374151]">备注</p>
                <NInput
                    type="textarea"
                    :value="form.remark"
                    :rows="5"
                    @update:value="$emit('update:form-field', 'remark', $event)"
                />
            </div>

            <div class="rounded-sm border border-[#e5e7eb] p-4 xl:col-span-2">
                <div class="flex flex-wrap items-center gap-3">
                    <span class="text-sm font-medium text-[#374151]">合同模板</span>
                    <NButton secondary>编辑合同</NButton>
                    <NButton secondary>重置模板</NButton>
                    <span class="ml-2 text-sm text-[#6b7280]">需要加盖电子印章</span>
                    <NSelect
                        class="w-[180px]"
                        :value="form.needElectronicSeal"
                        :options="yesNoOptions"
                        @update:value="
                            $emit('update:form-field', 'needElectronicSeal', $event ?? '')
                        "
                    />
                </div>
            </div>

            <div class="rounded-sm border border-[#e5e7eb] p-4 xl:col-span-2">
                <div class="flex flex-wrap items-center gap-3">
                    <span class="text-sm font-medium text-[#374151]">非标合同或附件</span>
                    <NInput
                        class="min-w-[320px] flex-1"
                        :value="form.attachmentName"
                        placeholder="暂未上传附件"
                        @update:value="$emit('update:form-field', 'attachmentName', $event)"
                    />
                    <NButton secondary>上传附件</NButton>
                </div>
            </div>
        </div>
    </NCard>
</template>
