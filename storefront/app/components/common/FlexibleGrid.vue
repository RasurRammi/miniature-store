<script setup lang="ts" generic="T extends { id: string }">
const { items, size = 6, itemClass } = defineProps<{
  items: T[]
  size?: number
  itemClass?: (item: T) => unknown
}>()
const emit = defineEmits<{
  click: [item: T]
}>()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(auto-fill, minmax(${size}rem, 1fr))`,
}))
</script>

<template>
  <div
    class="grid gap-2"
    :style="gridStyle"
  >
    <div
      v-for="item in items"
      :key="item.id"
      class="relative aspect-square rounded-lg overflow-hidden"
      :class="itemClass?.(item)"
      @click="emit('click', item)"
    >
      <slot :item="item" />
    </div>
  </div>

  <template v-if="!items.length">
    <slot name="empty" />
  </template>
</template>

<style scoped>

</style>
