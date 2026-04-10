export type OnlyOfficeDocumentType = 'cell' | 'pdf' | 'slide' | 'word';

export type OnlyOfficeEditorMode = 'edit' | 'view';

export interface OnlyOfficePluginsConfig {
    autostart?: string[];
    pluginsData?: string[];
}

export interface OnlyOfficeDocumentConfig {
    document: {
        fileType: string;
        key: string;
        title: string;
        url: string;
    };
    documentType: OnlyOfficeDocumentType;
    editorConfig: {
        callbackUrl?: string;
        plugins?: OnlyOfficePluginsConfig;
    };
}

export interface OnlyOfficePluginDefinition {
    autostart?: boolean;
    configUrl: string;
    guid: string;
    name: string;
}

export interface OnlyOfficePluginRuntimeContext {
    fileType: string;
    mode: OnlyOfficeEditorMode;
}
