const ONLYOFFICE_KEY_MAX_LENGTH = 128;

function sanitizeOnlyOfficeKeySegment(value: string) {
    return value.replaceAll(/[^\w\-.=]/g, '-');
}

export function createOnlyOfficeDocumentKey(baseKey: string) {
    const normalizedBaseKey = sanitizeOnlyOfficeKeySegment(baseKey).replaceAll(/-+/g, '-');
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const maxBaseLength = Math.max(1, ONLYOFFICE_KEY_MAX_LENGTH - suffix.length - 1);
    const truncatedBaseKey = normalizedBaseKey.slice(0, maxBaseLength) || 'document';

    return `${truncatedBaseKey}-${suffix}`;
}
