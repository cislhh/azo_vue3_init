import { describe, expect, it } from 'vitest';
import {
    buildOnlyOfficeAllowedOrigins,
    buildOnlyOfficePluginDefinitions,
    buildOnlyOfficePluginsConfig,
} from './plugin-config';

describe('buildOnlyOfficePluginDefinitions', () => {
    it('为 pdf 文档只启用业务工具栏插件', () => {
        const plugins = buildOnlyOfficePluginDefinitions({
            baseOrigin: 'http://localhost:5173',
            documentType: 'pdf',
            fileType: 'pdf',
            pluginVersion: '20260411.01',
        });

        expect(plugins).toHaveLength(1);
        expect(plugins[0]).toMatchObject({
            guid: 'empower-toolbar',
            autostart: true,
            configUrl:
                'http://localhost:5173/onlyoffice-plugins/empower-toolbar/config.json?v=20260411.01',
        });
    });

    it('为 word 文档同时启用业务工具栏和水印插件', () => {
        const plugins = buildOnlyOfficePluginDefinitions({
            baseOrigin: 'http://localhost:5173',
            documentType: 'word',
            fileType: 'docx',
            pluginVersion: '20260411.01',
        });

        expect(plugins.map((plugin) => plugin.guid)).toEqual([
            'empower-toolbar',
            'watermark-plugin',
        ]);
    });

    it('为 excel 文档只启用业务工具栏插件', () => {
        const plugins = buildOnlyOfficePluginDefinitions({
            baseOrigin: 'http://localhost:5173',
            documentType: 'cell',
            fileType: 'xlsx',
            pluginVersion: '20260411.01',
        });

        expect(plugins.map((plugin) => plugin.guid)).toEqual(['empower-toolbar']);
    });
});

describe('buildOnlyOfficePluginsConfig', () => {
    it('生成 OnlyOffice 插件配置', () => {
        const plugins = buildOnlyOfficePluginDefinitions({
            baseOrigin: 'http://localhost:5173',
            documentType: 'word',
            fileType: 'docx',
            pluginVersion: '20260411.01',
        });

        expect(buildOnlyOfficePluginsConfig(plugins)).toEqual({
            autostart: ['empower-toolbar', 'watermark-plugin'],
            pluginsData: [
                'http://localhost:5173/onlyoffice-plugins/empower-toolbar/config.json?v=20260411.01',
                'http://localhost:5173/onlyoffice-plugins/watermark_plugin/config.json?v=20260411.01',
            ],
        });
    });
});

describe('buildOnlyOfficeAllowedOrigins', () => {
    it('合并当前页面、文档服务和插件来源', () => {
        const plugins = buildOnlyOfficePluginDefinitions({
            baseOrigin: 'http://localhost:5173',
            documentType: 'word',
            fileType: 'docx',
            pluginVersion: '20260411.01',
        });

        expect(
            buildOnlyOfficeAllowedOrigins({
                currentOrigin: 'http://localhost:5173',
                documentServerUrl: 'http://localhost:80',
                plugins,
            }),
        ).toEqual(['http://localhost:5173', 'http://localhost']);
    });
});
