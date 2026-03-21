<script setup lang="ts" generic="T extends {id: string}">
import FlexibleGrid from '~/components/common/FlexibleGrid.vue'

const selectedItemIds = defineModel<string[]>({ required: true })
const { items } = defineProps<{
  items: T[]
  size?: number
}>()
const selectedSet = computed(() => new Set(selectedItemIds.value))

function toggle(id: string) {
  const next = new Set(selectedItemIds.value)
  if (next.has(id)) {
    next.delete(id)
  }
  else {
    next.add(id)
  }
  selectedItemIds.value = [...next]
}
</script>

<template>
  <FlexibleGrid
    :items="items"
    :size="size"
    :item-class="(item: T) => ['transition-all cursor-pointer ring-2', selectedSet.has(item.id) ? 'ring-primary' : 'ring-transparent']"
    @click="(item: T) => toggle(item.id)"
  >
    <template #default="{ item }">
      <slot
        :item="item"
      />

      <!-- Checkbox overlay -->
      <div class="absolute top-1 left-1">
        <UCheckbox
          :model-value="selectedSet.has(item.id)"
          @click.stop
          @update:model-value="toggle(item.id)"
        />
      </div>

      <!-- Selection overlay -->
      <div
        v-if="selectedSet.has(item.id)"
        class="absolute inset-0 bg-primary/20"
      />
    </template>
    <template #empty>
      <slot name="empty" />
    </template>
  </FlexibleGrid>
</template>

<style scoped>

</style>
