<script setup lang="ts">
import type { FilterCategory, FilterOperator, FilterValue, SearchMenuContext } from '~/types/filteredSearch'

const { categories } = defineProps<{
  categories: FilterCategory[]
}>()
const { search, step, activeCategory, keyEvent } = inject<SearchMenuContext>('searchMenuContext')!

const emit = defineEmits<{
  selectCategory: [category: FilterCategory]
  selectOperator: [operator: FilterOperator]
  selectValue: [value: FilterValue]
}>()

const OPERATORS: { value: FilterOperator, label: string, icon: string }[] = [
  { value: 'is', label: 'is', icon: 'i-lucide-equal' },
  { value: 'is one of', label: 'is one of', icon: 'i-lucide-equal' },
  { value: 'is not one of', label: 'is not one of', icon: 'i-lucide-equal-not' },
]

const filteredCategories = computed(() => {
  if (!search.value.trim()) return categories
  return categories.filter(cat =>
    cat.label.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const filteredValues = computed(() =>
  (activeCategory.value?.values ?? []).filter(v =>
    v.label.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

// -- Keyboard navigation

watch(keyEvent, (e: KeyboardEvent | null) => {
  console.debug('watch keyEvent', keyEvent)
  if (!e) return
  if (e.key === 'ArrowDown') moveDown()
  else if (e.key === 'ArrowUp') moveUp()
  else if (e.key === 'Enter') confirm()
})

const activeList = computed(() => {
  if (step.value === 'category') return filteredCategories.value
  if (step.value === 'operator') return OPERATORS
  if (step.value === 'value') return filteredValues.value
  return []
})

const selectedIndex = ref(-1)

watch(search, (val) => {
  selectedIndex.value = val.trim() ? 0 : -1
})

watch(step, (step) => {
  selectedIndex.value = step === 'category'
    ? -1
    : 0
})

watch(activeList, (list) => {
  // Clamp index when list shrinks
  if (selectedIndex.value >= list.length) {
    selectedIndex.value = list.length - 1
  }
})

function moveDown() {
  if (activeList.value.length === 0) return
  selectedIndex.value = selectedIndex.value < activeList.value.length - 1
    ? selectedIndex.value + 1
    : 0
}

function moveUp() {
  if (activeList.value.length === 0) return
  selectedIndex.value = selectedIndex.value > 0
    ? selectedIndex.value - 1
    : activeList.value.length - 1
}

function confirm() {
  if (selectedIndex.value === -1) return
  const item = activeList.value[selectedIndex.value]
  if (!item) return

  if (step.value === 'category') emit('selectCategory', item as FilterCategory)
  else if (step.value === 'operator') emit('selectOperator', (item as typeof OPERATORS[0]).value)
  else if (step.value === 'value') emit('selectValue', item as FilterValue)
}
</script>

<template>
  <div class="flex flex-col w-64">
    <!-- Step: Category -->
    <template v-if="step === 'category'">
      <div class="px-1 py-1">
        <p class="text-xs text-muted px-2 py-1 font-medium uppercase tracking-wide">
          Filter by
        </p>
        <button
          v-for="(category, idx) in filteredCategories"
          :key="category.id"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-elevated transition-colors text-left"
          :class="{ 'bg-elevated ring-1 ring-primary': selectedIndex === idx }"
          @click="emit('selectCategory', category)"
        >
          <UIcon
            v-if="category.icon"
            :name="category.icon"
            class="size-4 text-muted shrink-0"
          />
          <span>{{ category.label }}</span>
        </button>
        <button
          v-if="filteredCategories.length === 0"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-elevated transition-colors text-left"
          @click="emit('selectCategory', 'text')"
        >
          <UIcon
            name="i-lucide-text-cursor-input"
            class="size-4 text-muted shrink-0"
          />
          <span>Search Text</span>
        </button>
      </div>
    </template>

    <!-- Step: Operator -->
    <template v-else-if="step === 'operator'">
      <div class="px-1 py-1">
        <p class="text-xs text-muted px-2 py-1 font-medium uppercase tracking-wide">
          {{ activeCategory?.label }} operator
        </p>
        <button
          v-for="(op, idx) in OPERATORS"
          :key="op.value"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-elevated transition-colors text-left"
          :class="{ 'bg-elevated ring-1 ring-primary': selectedIndex === idx }"
          @click="emit('selectOperator', op.value)"
        >
          <UIcon
            :name="op.icon"
            class="size-4 text-muted shrink-0"
          />
          <span>{{ op.label }}</span>
        </button>
      </div>
    </template>

    <!-- Step: Value -->
    <template v-else-if="step === 'value'">
      <div class="px-1 py-1">
        <p class="text-xs text-muted px-2 py-1 font-medium uppercase tracking-wide">
          {{ activeCategory?.label }} value
        </p>
        <button
          v-for="(value, idx) in filteredValues"
          :key="value.id"
          class="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-elevated transition-colors text-left"
          :class="{ 'bg-elevated ring-1 ring-primary': selectedIndex === idx }"
          @click="emit('selectValue', value)"
        >
          <span>{{ value.label }}</span>
        </button>
        <p
          v-if="filteredValues.length === 0"
          class="text-sm text-muted px-2 py-2"
        >
          No values found
        </p>
      </div>
    </template>
  </div>
</template>
