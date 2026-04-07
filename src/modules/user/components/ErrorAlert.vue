<script setup lang="ts">
interface Props {
    message: string;
}
defineProps<Props>();
</script>

<template>
    <div class="mb-4 rounded bg-red-100 p-3 text-red-700">
        {{ message }}
    </div>
</template>
