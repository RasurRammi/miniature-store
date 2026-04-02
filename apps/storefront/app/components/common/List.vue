<script setup lang="ts" generic="T extends {id: string}">
const { items, itemClass } = defineProps<{
  items: T[]
  itemClass?: (item: T) => unknown
}>()

defineSlots<{
  'default': (props: { item: T }) => unknown
  'actions': (props: { item: T }) => unknown
  'expanded-content': (props: { item: T }) => unknown
  'add-row': () => unknown
  'empty': () => unknown
}>()

const collapsedIds = reactive(new Set<string>())

function toggleExpanded(id: string) {
  if (collapsedIds.has(id)) {
    collapsedIds.delete(id)
  }
  else {
    collapsedIds.add(id)
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
        class="flex flex-row gap-2 justify-between rounded-lg p-2"
        :class="[collapsedIds.has(item.id) ? 'bg-elevated/50' : 'bg-elevated/75', itemClass?.(item)]"
      >
        <div class="flex flex-row flex-1 items-center gap-1">
          <UButton
            v-if="$slots['expanded-content']"
            icon="i-lucide-chevron-down"
            variant="ghost"
            color="neutral"
            :class="{ 'duration-200 rotate-180': !collapsedIds.has(item.id) }"
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
        v-show="!collapsedIds.has(item.id)"
        class="ml-4"
      >
        <slot
          name="expanded-content"
          :item="item"
        />
      </div>
    </template>

    <slot
      v-if="!items.length"
      name="empty"
    />

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
