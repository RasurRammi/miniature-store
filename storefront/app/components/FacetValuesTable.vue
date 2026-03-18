<script setup lang="ts">
import { UButton, UInput } from '#components'
import List from '~/components/common/List.vue'
import type { Facet, FacetValue } from '~/gql/admin/graphql'
import { useProductFilter } from '~/stores/productFilter'
import { getFacetId, getValueId, useDirtyList } from '~/composables/useDirtyList'

const facetValues = defineModel<FacetValue[]>({ required: true })
const { facetId } = defineProps<{ facetId: string }>()

const productFilter = useProductFilter()
const dirtyFacetVList = useDirtyList(facetValues, getValueId)
const isFacetDeleted = () => dirtyFacetVList.getValueMeta(getFacetId({ id: facetId } as Facet))?.isDeleted

const newValueName = ref('')

function onAddValue() {
  if (!newValueName.value?.trim()) return
  dirtyFacetVList.addNewItem({ name: newValueName.value, facetId: facetId })
  newValueName.value = ''
}

function getFilterState(facetV: FacetValue) {
  return productFilter.facetGroups.get(facetId)?.get(facetV.id)
}
// State-machine: none → include → exclude → none
function toggleFilterState(facetV: FacetValue) {
  const state = getFilterState(facetV)
  if (!state) {
    productFilter.addFacetValue(facetId, facetV.id, 'include')
  }
  else if (state === 'include') {
    productFilter.addFacetValue(facetId, facetV.id, 'exclude')
  }
  else {
    productFilter.removeFacetValue(facetId, facetV.id)
  }
}
function getFilterButtonProps(facetV: FacetValue) {
  const state = getFilterState(facetV)
  return {
    icon: state !== 'exclude' ? 'i-lucide-filter' : 'i-lucide-filter-x',
    color: state === 'include' ? 'success' : state === 'exclude' ? 'error' : 'neutral',
    variant: state ? 'subtle' : 'ghost',
  } as const
}
</script>

<template>
  <List
    :items="facetValues"
    :item-class="(facetV: FacetValue) => ({ 'opacity-50 line-through': dirtyFacetVList.getMeta(facetV)?.isDeleted })"
  >
    <template #default="{ item: facetV }">
      <UChip
        position="top-left"
        inset
        size="xl"
        :color="dirtyFacetVList.getChipColor(facetV)"
        :show="!!dirtyFacetVList.getChipColor(facetV)"
        class="min-w-0 justify-start flex-1"
      >
        <UInput
          v-if="!dirtyFacetVList.getMeta(facetV)?.isDeleted"
          :model-value="dirtyFacetVList.getMeta(facetV)?.model"
          variant="ghost"
          class="text-primary"
          @update:model-value="dirtyFacetVList.updateItem(facetV, $event)"
        />
        <span
          v-else
          class="self-center text-muted pl-2"
        >
          {{ dirtyFacetVList.getMeta(facetV)?.model }}
        </span>
      </UChip>
    </template>
    <template #actions="{ item: facetV }">
      <template v-if="!isFacetDeleted()">
        <UButton
          v-if="dirtyFacetVList.getMeta(facetV)?.isDeleted"
          icon="i-lucide-undo"
          color="neutral"
          variant="ghost"
          @click="dirtyFacetVList.restoreItem(facetV)"
        />
        <UButton
          v-else
          icon="i-lucide-trash-2"
          color="primary"
          variant="ghost"
          @click="dirtyFacetVList.deleteItem(facetV)"
        />
      </template>
      <UButton
        v-bind="getFilterButtonProps(facetV)"
        @click="toggleFilterState(facetV)"
      />
      <UButton
        icon="i-lucide-book-check"
        color="neutral"
        variant="ghost"
        aria-label="Assign to selected Products"
        @click="console.log('test')"
      />
    </template>
    <template
      v-if="!isFacetDeleted()"
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
