export const EMPOWER_TOOLBAR_COMPARE_TYPE = 'empower-toolbar:compare-file-selected';
export const EMPOWER_TOOLBAR_MESSAGE_SOURCE = 'empower-toolbar-plugin';

interface ComparePluginMessage {
    source?: string;
    type?: string;
}

export interface OnlyOfficeRevisedFilePayload {
    fileType: 'docx';
    token?: string;
    url: string;
}

export function buildEmpowerToolbarCompareRequest(message: ComparePluginMessage) {
    if (
        message.source !== EMPOWER_TOOLBAR_MESSAGE_SOURCE ||
        message.type !== EMPOWER_TOOLBAR_COMPARE_TYPE
    ) {
        return null;
    }

    return {
        source: EMPOWER_TOOLBAR_MESSAGE_SOURCE,
        type: EMPOWER_TOOLBAR_COMPARE_TYPE,
    };
}

export async function handleEmpowerToolbarCompareMessage(
    event: MessageEvent,
    options: {
        allowedOrigins: string[];
        editor: { setRevisedFile?: (payload: OnlyOfficeRevisedFilePayload) => void } | null;
        revisedFile: OnlyOfficeRevisedFilePayload | null;
    },
) {
    if (!options.allowedOrigins.includes(event.origin)) {
        return false;
    }

    const request = buildEmpowerToolbarCompareRequest(event.data as ComparePluginMessage);
    if (!request) {
        return false;
    }

    if (!options.editor?.setRevisedFile || !options.revisedFile) {
        throw new Error('当前编辑器暂不支持文档对比');
    }

    options.editor.setRevisedFile(options.revisedFile);
    return true;
}
