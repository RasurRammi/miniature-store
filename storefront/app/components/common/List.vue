<script setup lang="ts" generic="T extends {id: string}">
import { UButton } from '#components'

const { items, itemClass } = defineProps<{
  items: T[]
  itemClass?: (item: T) => unknown
}>()

const expandedIds = reactive(new Set<string>())

function toggleExpanded(id: string) {
  if (expandedIds.has(id)) {
    expandedIds.delete(id)
  }
  else {
    expandedIds.add(id)
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <template
      v-for="item in items"
      :key="item.id"
    >
      <div
        class="flex flex-row gap-2 justify-between rounded-lg  p-2"
        :class="[expandedIds.has(item.id) ? 'bg-elevated' : 'bg-elevated/50', itemClass?.(item)]"
      >
        <div class="flex flex-row items-center gap-1">
          <UButton
            v-if="$slots['expanded-content']"
            icon="i-lucide-chevron-down"
            variant="ghost"
            color="neutral"
            :class="{ 'duration-200 rotate-180': expandedIds.has(item.id) }"
            @click="toggleExpanded(item.id)"
          />
          <slot :item="item" />
        </div>
        <div class="flex flex-row items-center gap-1">
          <slot
            name="actions"
            :item="item"
          />
        </div>
      </div>
      <div
        v-if="$slots['expanded-content']"
        v-show="expandedIds.has(item.id)"
        class="ml-4"
      >
        <slot
          name="expanded-content"
          :item="item"
        />
      </div>
    </template>

    <div
      v-if="$slots['add-row']"
      class="p-2 flex flex-row gap-2 justify-between rounded-lg bg-elevated/50"
    >
      <slot name="add-row" />
    </div>
  </div>
</template>

<style scoped>

</style>
