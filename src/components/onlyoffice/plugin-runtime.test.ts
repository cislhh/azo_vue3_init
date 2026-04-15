import { describe, expect, it } from 'vitest';

import {
    buildEmpowerToolbarRuntimeResponse,
    EMPOWER_TOOLBAR_MESSAGE_SOURCE,
} from './plugin-runtime';

describe('buildEmpowerToolbarRuntimeResponse', () => {
    it('includes the stamp image URL in the toolbar runtime context', () => {
        expect(
            buildEmpowerToolbarRuntimeResponse(
                {
                    source: EMPOWER_TOOLBAR_MESSAGE_SOURCE,
                    type: 'empower-toolbar:request-runtime-context',
                },
                {
                    fileType: 'docx',
                    mode: 'edit',
                    stampImageUrl: '/z.png',
                },
            ),
        ).toEqual({
            context: {
                fileType: 'docx',
                mode: 'edit',
                stampImageUrl: '/z.png',
            },
            source: EMPOWER_TOOLBAR_MESSAGE_SOURCE,
            type: 'empower-toolbar:runtime-context',
        });
    });
});
