<script setup lang="ts" generic="I">
import type { FilteredSearchContext, FilterValue, ValueGroup } from '~/types/filteredSearch'
import FilterMenuButton from '~/components/filteredSearch/FilterMenuButton.vue'

const { selectableItems, search, step, keyEvent } = inject<FilteredSearchContext<I>>('filteredSearchContext')!

const emit = defineEmits<{
  selectItem: [FilterValue]
}>()

const items = computed<FilterValue[]>(() => {
  const items: FilterValue[] = []
  if (!selectableItems.value) return items
  if (selectableItems.value.noneAllowed) {
    items.push({ id: 'none', label: 'None' })
  }
  if (selectableItems.value.anyAllowed) {
    items.push({ id: 'any', label: 'Any' })
  }
  if (isValueGroupArray(selectableItems.value.values)) {
    items.push(...selectableItems.value.values.flatMap(vG => vG.values))
  }
  else {
    items.push(...selectableItems.value.values)
  }
  return items
})
function isValueGroupArray(values: ValueGroup[] | FilterValue[]): values is ValueGroup[] {
  return values.length > 0 && 'values' in values[0]!
}

// -- Keyboard navigation

const selectedIndex = ref(-1)

const selectedValueId = computed(() => {
  if (selectedIndex.value === -1) return -1
  return items.value[selectedIndex.value]?.id ?? -1
})

watch(search, (val) => {
  selectedIndex.value = val.trim() ? 0 : -1
})

watch(step, (step) => {
  selectedIndex.value = step
    ? -1
    : 0
})

watch(keyEvent, (e: KeyboardEvent | null) => {
  console.debug('watch keyEvent', keyEvent)
  if (!e) return
  if (e.key === 'ArrowDown') moveDown()
  else if (e.key === 'ArrowUp') moveUp()
  else if (e.key === 'Enter') confirm()
})

function moveDown() {
  if (items.value.length === 0) return
  selectedIndex.value = selectedIndex.value < items.value.length - 1
    ? selectedIndex.value + 1
    : 0
}

function moveUp() {
  if (items.value.length === 0) return
  selectedIndex.value = selectedIndex.value > 0
    ? selectedIndex.value - 1
    : items.value.length - 1
}

function confirm() {
  if (selectedIndex.value === -1) return

  const item = items.value[selectedIndex.value]
  if (!item) return
  emit('selectItem', item)
}
</script>

<template>
  <div class="flex flex-col min-w-48">
    <div class="p-1">
      <p class="text-xs text-muted px-2 py-1 font-medium uppercase tracking-wide">
        Select value
      </p>

      <FilterMenuButton
        v-if="selectableItems.noneAllowed"
        :data="{ id: 'none', label: 'None' }"
        :selected="selectedValueId === 'none'"
        @clicked="i => emit('selectItem', i)"
      />

      <FilterMenuButton
        v-if="selectableItems.anyAllowed"
        :data="{ id: 'any', label: 'Any' }"
        :selected="selectedValueId === 'any'"
        @clicked="(i: FilterValue) => emit('selectItem', i)"
      />

      <USeparator
        v-if="selectableItems.noneAllowed || selectableItems.anyAllowed"
        class="p-0.5"
      />

      <template v-if="isValueGroupArray(selectableItems.values)">
        <template
          v-for="group in selectableItems.values"
          :key="group.id"
        >
          <USeparator
            v-if="group.label"
            class="p-0.5"
          >
            <span class="text-muted text-sm">{{ group.label }}</span>
          </USeparator>

          <FilterMenuButton
            v-for="value in group.values"
            :key="value.id"
            :data="value"
            :selected="selectedValueId === value.id"
            @clicked="i => emit('selectItem', i)"
          />
        </template>
      </template>
      <template v-else>
        <FilterMenuButton
          v-for="value in selectableItems.values"
          :key="value.id"
          :data="value"
          :selected="selectedValueId === value.id"
          @clicked="i => emit('selectItem', i)"
        />
      </template>
      <p
        v-if="selectableItems.length === 0"
        class="text-sm text-muted px-2 py-2"
      >
        No values found
      </p>
    </div>
  </div>
</template>
