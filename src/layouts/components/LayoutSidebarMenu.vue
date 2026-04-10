<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import type { LayoutMenuItem } from '../config/layout-menu';
import { resolveExpandedKeys } from './layout-sidebar-menu.utils';

interface Props {
    items: LayoutMenuItem[];
}

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();

function toMenuOptions(items: LayoutMenuItem[]): MenuOption[] {
    return items.map((item) => ({
        key: item.key,
        label: item.label,
        children: item.children ? toMenuOptions(item.children) : undefined,
    }));
}

function findMatchedKey(items: LayoutMenuItem[], currentPath: string): string | null {
    for (const item of items) {
        if (item.children) {
            const matchedChildKey = findMatchedKey(item.children, currentPath);
            if (matchedChildKey) {
                return matchedChildKey;
            }
        }

        if (item.path === currentPath) {
            return item.key;
        }
    }

    return null;
}

function collectExpandedKeys(items: LayoutMenuItem[], currentPath: string, parents: string[] = []) {
    for (const item of items) {
        const currentKey = item.path ?? item.key;
        if (item.path === currentPath) {
            return item.children ? [...parents, currentKey] : parents;
        }

        if (item.children) {
            const matched = collectExpandedKeys(item.children, currentPath, [
                ...parents,
                currentKey,
            ]);
            if (matched) {
                return matched;
            }
        }
    }

    return null;
}

const menuOptions = computed(() => toMenuOptions(props.items));
const activeKey = computed(() => findMatchedKey(props.items, route.path) ?? null);
const manualExpandedKeys = shallowRef<string[]>([]);
const expandedKeys = computed(() =>
    resolveExpandedKeys(
        collectExpandedKeys(props.items, route.path) ?? [],
        manualExpandedKeys.value,
    ),
);

function findPathByKey(items: LayoutMenuItem[], targetKey: string): string | null {
    for (const item of items) {
        if (item.key === targetKey) {
            return item.path ?? null;
        }

        if (item.children) {
            const matchedPath = findPathByKey(item.children, targetKey);
            if (matchedPath) {
                return matchedPath;
            }
        }
    }

    return null;
}

function handleUpdateValue(key: string) {
    const targetPath = findPathByKey(props.items, key);
    if (targetPath) {
        void router.push(targetPath);
    }
}

function handleUpdateExpandedKeys(keys: string[]) {
    manualExpandedKeys.value = keys;
}
</script>

<template>
    <NMenu
        :value="activeKey"
        :expanded-keys="expandedKeys"
        :options="menuOptions"
        accordion
        :indent="18"
        @update:value="handleUpdateValue"
        @update:expanded-keys="handleUpdateExpandedKeys"
    />
</template>

<style scoped>
:deep(.n-menu) {
    background: transparent;
}
</style>
