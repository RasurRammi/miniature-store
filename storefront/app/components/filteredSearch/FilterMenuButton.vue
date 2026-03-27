<script setup lang="ts">
const { data, selected } = defineProps<{ data: { id: string, label: string }, selected: boolean }>()
const emit = defineEmits<{ clicked: [{ id: string, label: string }] }>()
</script>

<template>
  <button
    class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-elevated transition-colors text-left"
    :class="{ 'bg-elevated ring-1 ring-primary': selected }"
    @click="emit('clicked', data)"
  >
    <span>{{ data.label }}</span>
  </button>
</template>

<style scoped>

</style>
