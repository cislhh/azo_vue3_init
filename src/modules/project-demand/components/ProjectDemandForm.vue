<script setup lang="ts">
import { NButton, NInput, NSelect } from 'naive-ui';

import type { ProjectDemandFormModel } from '../composables/useProjectDemandPage';

interface SelectOption { label: string; value: string }

defineProps<{
    form: ProjectDemandFormModel;
    formErrors: Record<string, string>;
    contractTypeOptions: SelectOption[];
    departmentOptions: SelectOption[];
    undertakingUnitOptions: SelectOption[];
    principalUnitTypeOptions: SelectOption[];
    provinceOptions: SelectOption[];
    cityOptions: SelectOption[];
    campusOptions: SelectOption[];
    yesNoOptions: SelectOption[];
}>();

const emit = defineEmits<{
    'update:form-field': [key: keyof ProjectDemandFormModel, value: string];
    editContract: [];
}>();

const actionButtonColor = '#23c6ea';
</script>

<template>
    <div class="project-demand-form">
        <div class="form-row">
            <div class="form-field form-field--span-4">
                <div class="form-label form-label--required">项目名称</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.projectName"
                            @update:value="emit('update:form-field', 'projectName', $event)"
                        />
                    </div>
                    <p v-if="formErrors.projectName" class="field-error">
                        {{ formErrors.projectName }}
                    </p>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">合同类型</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NSelect
                            class="legacy-select"
                            placeholder="请选择"
                            :value="form.contractType"
                            :options="contractTypeOptions"
                            @update:value="emit('update:form-field', 'contractType', $event ?? '')"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-2">
                <div class="form-label">申请时间</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput class="legacy-input" :value="form.applicationTime" readonly />
                    </div>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">开始时间</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.startDate"
                            @update:value="emit('update:form-field', 'startDate', $event)"
                        />
                    </div>
                    <p v-if="formErrors.startDate" class="field-error">
                        {{ formErrors.startDate }}
                    </p>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">结束时间</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.endDate"
                            @update:value="emit('update:form-field', 'endDate', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-2">
                <div class="form-label">合同编号</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.contractNo"
                            @update:value="emit('update:form-field', 'contractNo', $event)"
                        />
                    </div>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">合同经费（元）</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.contractAmount"
                            @update:value="emit('update:form-field', 'contractAmount', $event)"
                        />
                    </div>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label">支配经费（元）</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.expenseAmount"
                            @update:value="emit('update:form-field', 'expenseAmount', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-2">
                <div class="form-label">校内编号</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.campusCode"
                            @update:value="emit('update:form-field', 'campusCode', $event)"
                        />
                    </div>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">所属单位</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NSelect
                            class="legacy-select"
                            placeholder="请选择"
                            :value="form.department"
                            :options="departmentOptions"
                            @update:value="emit('update:form-field', 'department', $event ?? '')"
                        />
                    </div>
                    <p v-if="formErrors.department" class="field-error">
                        {{ formErrors.department }}
                    </p>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">承担单位</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NSelect
                            class="legacy-select"
                            placeholder="请选择"
                            :value="form.undertakingUnit"
                            :options="undertakingUnitOptions"
                            @update:value="
                                emit('update:form-field', 'undertakingUnit', $event ?? '')
                            "
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-4">
                <div class="form-label form-label--required">委托单位</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.principalUnit"
                            @update:value="emit('update:form-field', 'principalUnit', $event)"
                        />
                    </div>
                    <p v-if="formErrors.principalUnit" class="field-error">
                        {{ formErrors.principalUnit }}
                    </p>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">委托单位单位类型</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NSelect
                            class="legacy-select"
                            placeholder="请选择"
                            :value="form.principalUnitType"
                            :options="principalUnitTypeOptions"
                            @update:value="
                                emit('update:form-field', 'principalUnitType', $event ?? '')
                            "
                        />
                    </div>
                    <p v-if="formErrors.principalUnitType" class="field-error">
                        {{ formErrors.principalUnitType }}
                    </p>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-2">
                <div class="form-label">经费卡号</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.expenseCardNo"
                            @update:value="emit('update:form-field', 'expenseCardNo', $event)"
                        />
                    </div>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">验收时间</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.acceptanceDate"
                            @update:value="emit('update:form-field', 'acceptanceDate', $event)"
                        />
                    </div>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">委托单位所在省</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NSelect
                            class="legacy-select"
                            placeholder="请选择"
                            :value="form.province"
                            :options="provinceOptions"
                            @update:value="emit('update:form-field', 'province', $event ?? '')"
                        />
                    </div>
                    <p v-if="formErrors.province" class="field-error">
                        {{ formErrors.province }}
                    </p>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">中期节点</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.middleNodeDate"
                            @update:value="emit('update:form-field', 'middleNodeDate', $event)"
                        />
                    </div>
                    <p v-if="formErrors.middleNodeDate" class="field-error">
                        {{ formErrors.middleNodeDate }}
                    </p>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label">经费合计（元）</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.totalAmount"
                            @update:value="emit('update:form-field', 'totalAmount', $event)"
                        />
                    </div>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">委托单位所在市</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NSelect
                            class="legacy-select"
                            placeholder="请选择"
                            :value="form.city"
                            :options="cityOptions"
                            @update:value="emit('update:form-field', 'city', $event ?? '')"
                        />
                    </div>
                    <p v-if="formErrors.city" class="field-error">
                        {{ formErrors.city }}
                    </p>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">校 区</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NSelect
                            class="legacy-select"
                            placeholder="请选择"
                            :value="form.campus"
                            :options="campusOptions"
                            @update:value="emit('update:form-field', 'campus', $event ?? '')"
                        />
                    </div>
                    <p v-if="formErrors.campus" class="field-error">
                        {{ formErrors.campus }}
                    </p>
                </div>
            </div>

            <div class="form-field form-field--span-2">
                <div class="form-label form-label--required">经办人联系电话</div>
                <div class="form-control">
                    <div class="control-shell">
                        <NInput
                            class="legacy-input"
                            :value="form.contactPhone"
                            @update:value="emit('update:form-field', 'contactPhone', $event)"
                        />
                    </div>
                    <p v-if="formErrors.contactPhone" class="field-error">
                        {{ formErrors.contactPhone }}
                    </p>
                </div>
            </div>

            <div aria-hidden="true" class="form-spacer form-field--span-2"></div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-6 form-field--remark">
                <div class="form-label">备 注</div>
                <div class="form-control">
                    <div class="control-shell control-shell--textarea">
                        <NInput
                            class="legacy-input legacy-input--textarea"
                            type="textarea"
                            :value="form.remark"
                            :rows="5"
                            @update:value="emit('update:form-field', 'remark', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-6">
                <div class="form-label form-label--required">合同模板</div>
                <div class="form-control">
                    <div class="control-shell control-shell--actions">
                        <NButton
                            class="action-button"
                            :color="actionButtonColor"
                            text-color="#ffffff"
                            @click="emit('editContract')"
                        >
                            编辑合同
                        </NButton>
                        <NButton
                            class="action-button"
                            :color="actionButtonColor"
                            text-color="#ffffff"
                        >
                            重置模板
                        </NButton>
                        <span class="action-text">需要加盖电子印章</span>
                        <div class="action-select-wrap">
                            <NSelect
                                class="legacy-select"
                                :value="form.needElectronicSeal"
                                :options="yesNoOptions"
                                @update:value="
                                    emit('update:form-field', 'needElectronicSeal', $event ?? '')
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-field form-field--span-6">
                <div class="form-label">非标合同或附件</div>
                <div class="form-control">
                    <div class="control-shell control-shell--upload">
                        <NInput
                            class="legacy-input attachment-input"
                            placeholder=""
                            :value="form.attachmentName"
                            @update:value="emit('update:form-field', 'attachmentName', $event)"
                        />
                        <NButton
                            class="action-button upload-button"
                            :color="actionButtonColor"
                            text-color="#ffffff"
                        >
                            上传附件
                        </NButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.project-demand-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid #d6dde7;
    background: #f7f7f7;
    padding: 14px;
}

.form-row {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 8px;
}

.form-field {
    display: grid;
    min-width: 0;
    grid-template-columns: 184px minmax(0, 1fr);
    align-items: start;
}

.form-field--span-2 {
    grid-column: span 2 / span 2;
}

.form-field--span-4 {
    grid-column: span 4 / span 4;
}

.form-field--span-6 {
    grid-column: span 6 / span 6;
}

.form-label {
    display: flex;
    min-height: 52px;
    align-items: center;
    justify-content: center;
    border: 1px solid #d6dde7;
    background: #f5f5f5;
    padding: 0 12px;
    text-align: center;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.35;
    color: #193d68;
}

.form-label--required::before {
    margin-right: 6px;
    color: #ff4d4f;
    content: '*';
    font-size: 15px;
    line-height: 1;
}

.form-control {
    min-width: 0;
}

.control-shell {
    display: flex;
    min-height: 52px;
    align-items: center;
    border: 1px solid #d6dde7;
    background: #ffffff;
    padding: 0 10px;
}

.control-shell--textarea {
    min-height: 138px;
    align-items: stretch;
    padding: 10px;
}

.control-shell--actions,
.control-shell--upload {
    gap: 10px;
    flex-wrap: wrap;
}

.control-shell--upload {
    justify-content: space-between;
}

.form-field--remark .form-label {
    min-height: 138px;
}

.legacy-input,
.legacy-select,
.action-select-wrap {
    width: 100%;
    min-width: 0;
}

.legacy-input :deep(.n-input),
.legacy-select :deep(.n-base-selection) {
    width: 100%;
}

.legacy-input :deep(.n-input),
.legacy-input :deep(.n-input-wrapper) {
    --n-border: none !important;
    --n-border-disabled: none !important;
    --n-border-focus: none !important;
    --n-border-hover: none !important;
    --n-border-radius: 0px !important;
    --n-box-shadow-focus: none !important;
    --n-color: transparent !important;
    --n-color-disabled: transparent !important;
    --n-padding-left: 0px !important;
    --n-padding-right: 0px !important;
}

.legacy-input :deep(.n-input__input-el),
.legacy-input :deep(.n-input__textarea-el) {
    font-size: 17px;
    color: #324760;
}

.legacy-input--textarea :deep(.n-input__textarea-el) {
    min-height: 116px !important;
    resize: none;
    line-height: 1.6;
}

.legacy-select :deep(.n-base-selection) {
    --n-border: none !important;
    --n-border-active: none !important;
    --n-border-disabled: none !important;
    --n-border-focus: none !important;
    --n-border-hover: none !important;
    --n-border-radius: 0px !important;
    --n-box-shadow-active: none !important;
    --n-box-shadow-focus: none !important;
    --n-color: transparent !important;
    --n-color-active: transparent !important;
    --n-color-disabled: transparent !important;
    --n-height: 40px !important;
}

.legacy-select :deep(.n-base-selection-label) {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

.legacy-select :deep(.n-base-selection-input),
.legacy-select :deep(.n-base-selection-placeholder),
.legacy-select :deep(.n-base-selection__render-label) {
    font-size: 17px;
    color: #324760;
}

.field-error {
    margin-top: 4px;
    padding-left: 4px;
    font-size: 12px;
    line-height: 1.4;
    color: #d03050;
}

.action-button {
    min-width: 104px;
    border-radius: 0;
    font-size: 17px;
}

.action-text {
    margin-left: 16px;
    font-size: 17px;
    font-weight: 700;
    color: #193d68;
}

.action-select-wrap {
    max-width: 160px;
}

.attachment-input {
    flex: 1;
}

.upload-button {
    min-width: 116px;
}

.form-spacer {
    min-height: 52px;
    border: 1px solid transparent;
}
</style>
