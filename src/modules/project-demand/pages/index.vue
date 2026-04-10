<script setup lang="ts">
import { OnlyOfficeDocumentModal } from '@/components/onlyoffice';

import ProjectDemandForm from '../components/ProjectDemandForm.vue';
import ProjectDemandMemberTable from '../components/ProjectDemandMemberTable.vue';
import ProjectDemandToolbar from '../components/ProjectDemandToolbar.vue';
import { useProjectDemandPage } from '../composables/useProjectDemandPage';

const {
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
    removeMember,
    openCreateMemberDialog,
    openEditMemberDialog,
    closeMemberDialog,
    saveMember,
    updateToolbarField,
    updateFormField,
} = useProjectDemandPage();
</script>

<template>
    <div class="space-y-6">
        <header class="rounded-sm bg-white p-5 shadow-sm">
            <h1 class="text-[clamp(24px,2vw,30px)] font-semibold text-[#22324d]">横向项目需求</h1>
            <p class="mt-2 text-sm text-[#6b7280]"
                >按业务流程填写项目基础信息、合同信息和成员信息。</p
            >
        </header>

        <ProjectDemandToolbar
            :toolbar-form="toolbarForm"
            :workflow-options="workflowOptions"
            :yes-no-options="yesNoOptions"
            :assignee-options="assigneeOptions"
            @update:toolbar-field="updateToolbarField"
            @submit="submit"
            @save-draft="saveDraft"
        />

        <ProjectDemandForm
            :form="form"
            :form-errors="formErrors"
            :contract-type-options="contractTypeOptions"
            :department-options="departmentOptions"
            :undertaking-unit-options="undertakingUnitOptions"
            :principal-unit-type-options="principalUnitTypeOptions"
            :province-options="provinceOptions"
            :city-options="cityOptions"
            :campus-options="campusOptions"
            :yes-no-options="yesNoOptions"
            @update:form-field="updateFormField"
            @edit-contract="openContractEditor"
        />

        <ProjectDemandMemberTable
            :rows="memberRows"
            :dialog-visible="memberDialogVisible"
            :editing-row="editingMember"
            :role-options="memberRoleOptions"
            @create="openCreateMemberDialog"
            @edit="openEditMemberDialog"
            @remove="removeMember"
            @save="saveMember"
            @cancel="closeMemberDialog"
        />

        <OnlyOfficeDocumentModal
            :show="contractEditorVisible"
            :loading="contractEditorLoading"
            :document-server-url="documentServerUrl"
            :config="contractEditorConfig"
            @close="closeContractEditor"
        />
    </div>
</template>
