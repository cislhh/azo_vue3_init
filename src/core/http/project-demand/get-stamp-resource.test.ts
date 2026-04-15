import { describe, expect, it } from 'vitest';

import { getProjectDemandStampResource } from './get-stamp-resource';

describe('getProjectDemandStampResource', () => {
    it('returns the development stamp image URL', async () => {
        await expect(getProjectDemandStampResource()).resolves.toEqual({
            code: 200,
            data: {
                imageUrl: '/z.png',
            },
            message: 'success',
        });
    });
});
