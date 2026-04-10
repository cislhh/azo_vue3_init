import { describe, expect, it } from 'vitest';
import {
    EMPOWER_TOOLBAR_MESSAGE_SOURCE,
    buildEmpowerToolbarRuntimeResponse,
} from './plugin-runtime';

describe('buildEmpowerToolbarRuntimeResponse', () => {
    it('为业务工具栏上下文请求生成响应报文', () => {
        expect(
            buildEmpowerToolbarRuntimeResponse(
                {
                    source: EMPOWER_TOOLBAR_MESSAGE_SOURCE,
                    type: 'empower-toolbar:request-runtime-context',
                },
                {
                    fileType: 'pdf',
                    mode: 'edit',
                },
            ),
        ).toEqual({
            context: {
                fileType: 'pdf',
                mode: 'edit',
            },
            source: EMPOWER_TOOLBAR_MESSAGE_SOURCE,
            type: 'empower-toolbar:runtime-context',
        });
    });

    it('忽略非业务工具栏消息', () => {
        expect(
            buildEmpowerToolbarRuntimeResponse(
                {
                    source: 'other-plugin',
                    type: 'empower-toolbar:request-runtime-context',
                },
                {
                    fileType: 'pdf',
                    mode: 'edit',
                },
            ),
        ).toBeNull();
    });
});
