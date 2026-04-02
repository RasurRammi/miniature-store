<script setup lang="ts" generic="V extends {id: string, label: string}">
const { item, selected } = defineProps<{
  item: V
  highlighted: boolean
  selected: boolean
  isMultiple: boolean
}>()
const emit = defineEmits<{
  itemSelected: [V]
}>()
</script>

<template>
  <UButton
    block
    color="neutral"
    variant="ghost"
    :label="item.label"
    :trailing-icon="isMultiple && selected ? 'i-lucide-check' : ''"
    class="px-2 py-1.5 rounded-md text-sm justify-between transition-colors"
    :class="[
      highlighted ? 'bg-elevated ring-1 ring-primary' : '',
      selected ? 'text-primary bg-elevated hover:bg-accented' : '',
    ]"
    @click="emit('itemSelected', item)"
  />
</template>

<style scoped>

</style>
