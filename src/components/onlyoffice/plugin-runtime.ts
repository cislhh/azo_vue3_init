import type { OnlyOfficePluginRuntimeContext } from './types';

export const EMPOWER_TOOLBAR_MESSAGE_SOURCE = 'empower-toolbar-plugin';
export const EMPOWER_TOOLBAR_REQUEST_RUNTIME_TYPE = 'empower-toolbar:request-runtime-context';
export const EMPOWER_TOOLBAR_RUNTIME_TYPE = 'empower-toolbar:runtime-context';

interface PluginMessage {
    source?: string;
    type?: string;
}

export function buildEmpowerToolbarRuntimeResponse(
    message: PluginMessage,
    context: OnlyOfficePluginRuntimeContext,
) {
    if (
        message.source !== EMPOWER_TOOLBAR_MESSAGE_SOURCE ||
        message.type !== EMPOWER_TOOLBAR_REQUEST_RUNTIME_TYPE
    ) {
        return null;
    }

    return {
        context,
        source: EMPOWER_TOOLBAR_MESSAGE_SOURCE,
        type: EMPOWER_TOOLBAR_RUNTIME_TYPE,
    };
}

export function replyEmpowerToolbarRuntimeContext(
    event: MessageEvent,
    options: {
        allowedOrigins: string[];
        context: OnlyOfficePluginRuntimeContext;
    },
) {
    if (!options.allowedOrigins.includes(event.origin)) {
        return false;
    }

    const response = buildEmpowerToolbarRuntimeResponse(
        event.data as PluginMessage,
        options.context,
    );

    if (!response) {
        return false;
    }

    const source = event.source as {
        postMessage?: (message: unknown, targetOrigin: string) => void;
    } | null;

    source?.postMessage?.(response, event.origin);

    return true;
}
