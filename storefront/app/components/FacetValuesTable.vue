<script setup lang="ts">
import { UButton, UDropdownMenu, UInput } from '#components'
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'
import type { FacetValue } from '~/gql/shop/graphql'
import { useDirtyStateStore } from '~/stores/useDirtyStateStore'
import { useProductFilter } from '~/stores/productFilter'
import List from '~/components/common/List.vue'

const facetValues = defineModel<FacetValue[]>({ required: true })
const { facetId } = defineProps<{ facetId: string }>()

const productFilter = useProductFilter()
const { addToList, removeFromList, getValueMeta, deleteValue, updateValue, restoreValue, getColorChip } = useDirtyStateStore()

function getValueId(facetV: FacetValue) {
  return `FacetValue:${facetV.id}`
}

onMounted(() => {
  facetValues.value.forEach(facetV => addToList(getValueId(facetV), {
    original: facetV.name,
    model: facetV.name,
    isNew: false,
    isDeleted: false,
  }))
})
onUnmounted(() => {
  facetValues.value.forEach(facetV => removeFromList(getValueId(facetV)))
})

const newValueName = ref('')
let newFacetVCounter = 0

function onAddValue() {
  if (!newValueName.value?.trim()) return
  const newFacetValue = {
    id: `new-${newFacetVCounter++}`,
    facetId: facetId,
    code: '',
    name: newValueName.value,
  } as FacetValue
  facetValues.value.push(newFacetValue)
  addToList(getValueId(newFacetValue), {
    original: newFacetValue.name,
    model: newFacetValue.name,
    isNew: true,
    isDeleted: false,
  })
  newValueName.value = ''
}

function deleteFacetValue(value: FacetValue) {
  if (value.id.startsWith('new-')) {
    // remove completely
    facetValues.value = facetValues.value.filter(facetV => facetV.id !== value.id)
    removeFromList(getValueId(value))
  }
  else {
    // mark as removed
    deleteValue(getValueId(value))
  }
}

function getDropdownActions(facetV: FacetValue): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Filter: Include',
        icon: 'i-lucide-filter',
        onSelect: () => {
          productFilter.addFacetValue(facetId, facetV.id, 'include')
        },
      },
      {
        label: 'Filter: Exclude',
        icon: 'i-lucide-filter-x',
        onSelect: () => {
          productFilter.addFacetValue(facetId, facetV.id, 'exclude')
        },
      },
    ],
  ]
}
</script>

<template>
  <List
    :items="facetValues"
    :item-class="(item) => ({ 'opacity-50 line-through': getValueMeta(getValueId(item))?.isDeleted })"
  >
    <template #default="{ item }">
      <UChip
        position="top-left"
        inset
        size="xl"
        :color="getColorChip(getValueId(item))"
        :show="!!getColorChip(getValueId(item))"
        class="min-w-0 justify-start flex-1"
      >
        <UInput
          v-if="!getValueMeta(getValueId(item))?.isDeleted"
          :model-value="getValueMeta(getValueId(item))?.model"
          variant="ghost"
          class="text-primary"
          @update:model-value="updateValue(getValueId(item), $event)"
        />
        <span
          v-else
          class="self-center text-muted pl-2"
        >
          {{ getValueMeta(getValueId(item))?.model }}
        </span>
      </UChip>
    </template>
    <template #actions="{ item }">
      <UButton
        v-if="getValueMeta(getValueId(item))?.isDeleted"
        icon="i-lucide-undo"
        color="neutral"
        variant="ghost"
        @click="restoreValue(getValueId(item))"
      />
      <UButton
        v-else
        icon="i-lucide-trash-2"
        color="primary"
        variant="ghost"
        @click="deleteFacetValue(item)"
      />
      <UDropdownMenu :items="getDropdownActions(item)">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu>
    </template>
    <template
      v-if="!getValueMeta(`Facet:${facetId}`)?.isDeleted"
      #add-row
    >
      <UInput
        v-model="newValueName"
        variant="ghost"
        placeholder="Add tag value..."
        @keydown.enter="onAddValue"
      />
      <UButton
        icon="i-lucide-plus"
        color="primary"
        variant="ghost"
        @click="onAddValue"
      />
    </template>
  </List>
</template>

<style scoped>

</style>
