<script setup lang="ts" generic="I">
import type { FilteredSearchContext, FilterValue } from '~/types/filteredSearch'
import { isValueGroupArray } from '~/types/filteredSearch'
import FilterMenuButton from '~/components/filteredSearch/FilterMenuButton.vue'

const {
  selectableItems,
  search,
  step,
  keyEvent,
  confirmSingleSelection,
  confirmMultiSelection,
} = inject<FilteredSearchContext<I>>('filteredSearchContext')!

// TODO prefill selection with selected value (need selectedIds)
const pendingSelection = ref<FilterValue[]>([])

// Clear pending when the step changes (fresh step = fresh selection)
watch(step, () => pendingSelection.value = [])

const isMultiple = computed(() => selectableItems.value?.multiple ?? false)

function isPending(id: string): boolean {
  return pendingSelection.value.some(v => v.id === id)
}

function togglePendingSelection(item: FilterValue) {
  const idx = pendingSelection.value.findIndex(v => v.id === item.id)
  pendingSelection.value = idx === -1
    ? [...pendingSelection.value, item]
    : pendingSelection.value.filter(v => v.id !== item.id)
}

function applyPending() {
  if (pendingSelection.value.length > 0) {
    confirmMultiSelection(pendingSelection.value)
    pendingSelection.value = []
  }
}

// Expose apply so parent's Escape handler can trigger it
defineExpose({ applyPending })

// -- Flat item list for keyboard navigation
const items = computed<FilterValue[]>(() => {
  const result: FilterValue[] = []
  if (!selectableItems.value) return result
  if (selectableItems.value.noneAllowed) result.push({ id: 'none', label: 'None' })
  if (selectableItems.value.anyAllowed) result.push({ id: 'any', label: 'Any' })
  if (isValueGroupArray(selectableItems.value.values)) {
    result.push(...selectableItems.value.values.flatMap(vG => vG.values))
  }
  else {
    result.push(...selectableItems.value.values)
  }
  return result
})

// ----- Keyboard navigation -----
const selectedIndex = ref(0)

const highlightedId = computed<string | null>(() =>
  items.value[selectedIndex.value]?.id ?? null,
)

watch(search, val => selectedIndex.value = val.trim() ? 0 : -1)
watch(step, () => selectedIndex.value = 0)
watch(items, (list) => {
  if (selectedIndex.value >= list.length) {
    selectedIndex.value = Math.max(list.length - 1, -1)
  }
})

watch(keyEvent, (e) => {
  if (!e) return
  if (e.key === 'ArrowDown') moveDown()
  else if (e.key === 'ArrowUp') moveUp()
  else if (e.key === 'Enter') activateHighlighted()
})

function moveDown() {
  if (!items.value.length) return
  selectedIndex.value = selectedIndex.value < items.value.length - 1
    ? selectedIndex.value + 1
    : 0
}

function moveUp() {
  if (!items.value.length) return
  selectedIndex.value = selectedIndex.value > 0
    ? selectedIndex.value - 1
    : items.value.length - 1
}

function activateHighlighted() {
  const item = items.value[selectedIndex.value]
  if (item) handleItemSelect(item)
}

// ----- Selection logic -----
function handleItemSelect(item: FilterValue) {
  // None / Any are always instant — mutually exclusive with multi-select
  if (item.id === 'none' || item.id === 'any') {
    pendingSelection.value = []
    confirmSingleSelection(item)
    return
  }

  if (!isMultiple.value) {
    confirmSingleSelection(item)
    return
  }

  togglePendingSelection(item)
}
</script>

<template>
  <div class="flex flex-col min-w-52">
    <div class="p-1">
      <p class="text-xs text-muted px-2 py-1 font-medium uppercase tracking-wide">
        Select {{ step?.id ?? 'category' }}{{ isMultiple ? 's' : '' }}
      </p>

      <template v-if="selectableItems">
        <!-- None / Any — instant-select, no checkbox -->
        <button
          v-if="selectableItems.noneAllowed"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-left transition-colors hover:bg-elevated"
          :class="{ 'bg-elevated ring-1 ring-primary': highlightedId === 'none' }"
          @click="handleItemSelect({ id: 'none', label: 'None' })"
        >
          <span>None</span>
        </button>

        <button
          v-if="selectableItems.anyAllowed"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-left transition-colors hover:bg-elevated"
          :class="{ 'bg-elevated ring-1 ring-primary': highlightedId === 'any' }"
          @click="handleItemSelect({ id: 'any', label: 'Any' })"
        >
          <span>Any</span>
        </button>

        <USeparator
          v-if="(selectableItems.noneAllowed || selectableItems.anyAllowed) && !isValueGroupArray(selectableItems.values)"
          class="my-0.5"
        />

        <!-- Value items — grouped or flat -->
        <template v-if="isValueGroupArray(selectableItems.values)">
          <template
            v-for="group in selectableItems.values"
            :key="group.id"
          >
            <USeparator
              v-if="group.label"
              class="my-0.5"
            >
              <span class="text-muted text-xs">{{ group.label }}</span>
            </USeparator>

            <div class="flex flex-col gap-0.5">
              <FilterMenuButton
                v-for="value in group.values"
                :key="value.id"
                :item="value"
                :highlighted="highlightedId === value.id"
                :selected="isPending(value.id)"
                :is-multiple="isMultiple"
                @item-selected="handleItemSelect"
              />
            </div>
          </template>
        </template>

        <template v-else>
          <div class="flex flex-col gap-0.5">
            <FilterMenuButton
              v-for="value in selectableItems.values"
              :key="value.id"
              :item="value"
              :highlighted="highlightedId === value.id"
              :selected="isPending(value.id)"
              :is-multiple="isMultiple"
              @item-selected="handleItemSelect"
            />
          </div>
        </template>
        <!--  -->

        <p
          v-if="items.length === 0"
          class="text-sm text-muted px-2 py-2"
        >
          No values found
        </p>

        <!-- Apply button — only shown when multi-select has pending values -->
        <template v-if="isMultiple && pendingSelection.length > 0">
          <USeparator class="my-0.5" />
          <div class="px-1 py-1">
            <UButton
              block
              color="primary"
              variant="soft"
              leading-icon="i-lucide-check"
              @click="applyPending"
            >
              Apply ({{ pendingSelection.length }})
            </UButton>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
