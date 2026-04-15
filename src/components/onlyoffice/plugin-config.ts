import type {
    OnlyOfficeDocumentType,
    OnlyOfficePluginDefinition,
    OnlyOfficePluginsConfig,
} from './types';

const EMPOWER_TOOLBAR_CONFIG_PATH = '/onlyoffice-plugins/empower-toolbar/config.json';
const WATERMARK_PLUGIN_CONFIG_PATH = '/onlyoffice-plugins/watermark_plugin/config.json';

interface BuildOnlyOfficePluginDefinitionsOptions {
    baseOrigin?: string;
    documentType?: OnlyOfficeDocumentType;
    enableToolbar?: boolean;
    enableWatermark?: boolean;
    fileType?: string;
    pluginVersion?: string;
}

interface BuildOnlyOfficeAllowedOriginsOptions {
    currentOrigin?: string;
    documentServerUrl?: string;
    plugins: OnlyOfficePluginDefinition[];
}

function resolveAbsoluteUrl(path: string, baseOrigin?: string, version?: string) {
    if (!baseOrigin) {
        return version ? `${path}?v=${encodeURIComponent(version)}` : path;
    }

    const url = new URL(path, baseOrigin);

    if (version) {
        url.searchParams.set('v', version);
    }

    return url.toString();
}

function isWordDocument(documentType?: OnlyOfficeDocumentType, fileType?: string) {
    return documentType === 'word' || fileType === 'doc' || fileType === 'docx';
}

export function buildOnlyOfficePluginDefinitions(
    options: BuildOnlyOfficePluginDefinitionsOptions = {},
) {
    const baseOrigin = options.baseOrigin ?? globalThis.location?.origin;
    const pluginVersion = options.pluginVersion?.trim();
    const plugins: OnlyOfficePluginDefinition[] = [];

    if (options.enableToolbar !== false && isWordDocument(options.documentType, options.fileType)) {
        plugins.push({
            autostart: true,
            configUrl: resolveAbsoluteUrl(EMPOWER_TOOLBAR_CONFIG_PATH, baseOrigin, pluginVersion),
            guid: 'empower-toolbar',
            name: '业务工具',
        });
    }

    if (
        options.enableWatermark !== false &&
        isWordDocument(options.documentType, options.fileType)
    ) {
        plugins.push({
            autostart: true,
            configUrl: resolveAbsoluteUrl(WATERMARK_PLUGIN_CONFIG_PATH, baseOrigin, pluginVersion),
            guid: 'watermark-plugin',
            name: '一键水印',
        });
    }

    return plugins;
}

export function buildOnlyOfficePluginsConfig(
    plugins: OnlyOfficePluginDefinition[],
): OnlyOfficePluginsConfig | undefined {
    if (plugins.length === 0) {
        return undefined;
    }

    const autostart = plugins.filter((plugin) => plugin.autostart).map((plugin) => plugin.guid);
    const pluginsData = plugins.map((plugin) => plugin.configUrl);

    return {
        autostart,
        pluginsData,
    };
}

export function buildOnlyOfficeAllowedOrigins(options: BuildOnlyOfficeAllowedOriginsOptions) {
    const origins = new Set<string>();

    if (options.currentOrigin) {
        origins.add(options.currentOrigin);
    }

    if (options.documentServerUrl) {
        origins.add(new URL(options.documentServerUrl).origin);
    }

    for (const plugin of options.plugins) {
        origins.add(new URL(plugin.configUrl, options.currentOrigin).origin);
    }

    return Array.from(origins);
}
