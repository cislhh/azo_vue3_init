export { default as OnlyOfficeDocumentModal } from './OnlyOfficeDocumentModal.vue';
export {
    buildOnlyOfficeAllowedOrigins,
    buildOnlyOfficePluginDefinitions,
    buildOnlyOfficePluginsConfig,
} from './plugin-config';
export {
    buildEmpowerToolbarRuntimeResponse,
    EMPOWER_TOOLBAR_MESSAGE_SOURCE,
    EMPOWER_TOOLBAR_REQUEST_RUNTIME_TYPE,
    EMPOWER_TOOLBAR_RUNTIME_TYPE,
    replyEmpowerToolbarRuntimeContext,
} from './plugin-runtime';
export {
    buildEmpowerToolbarCompareRequest,
    handleEmpowerToolbarCompareMessage,
    type OnlyOfficeRevisedFilePayload,
} from './compare-runtime';
export type {
    OnlyOfficeDocumentConfig,
    OnlyOfficeDocumentType,
    OnlyOfficeEditorMode,
    OnlyOfficePluginDefinition,
    OnlyOfficePluginRuntimeContext,
    OnlyOfficePluginsConfig,
} from './types';
