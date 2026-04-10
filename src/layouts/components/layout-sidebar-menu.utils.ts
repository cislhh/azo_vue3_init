export function resolveExpandedKeys(defaultExpandedKeys: string[], manualExpandedKeys: string[]) {
    return manualExpandedKeys.length > 0 ? manualExpandedKeys : defaultExpandedKeys;
}
