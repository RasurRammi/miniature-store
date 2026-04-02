<script setup lang="ts">
const model = defineModel<string>({ required: true })
const { originalValue } = defineProps<{ originalValue: string }>()
const isDirty = computed(() => model.value !== originalValue)
</script>

<template>
  <UChip
    position="top-left"
    inset
    size="xl"
    :show="isDirty"
  >
    <UInput
      v-model="model"
      color="primary"
      variant="ghost"
      class="text-primary"
    />
  </UChip>
</template>
