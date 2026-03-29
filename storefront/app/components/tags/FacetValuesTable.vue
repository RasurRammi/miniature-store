<script setup lang="ts">
import { UButton, UInput } from '#components'
import List from '~/components/common/List.vue'
import type { Facet, FacetValue } from '~/gql/admin/graphql'
import { getFacetId, getValueId, useDirtyList } from '~/composables/useDirtyList'
import type { ProductSelectionContext } from '~/pages/admin/catalogue/tags.vue'

const facetValues = defineModel<FacetValue[]>({ required: true })
const { facetId, isEditing } = defineProps<{
  facetId: string
  isEditing: boolean
}>()
const { selectedValueIds: selectionState, anySelected, toggleValueState } = inject<ProductSelectionContext>('productSelection')!
const dirtyFacetVList = useDirtyList(facetValues, getValueId)
const isFacetDeleted = () => dirtyFacetVList.getValueMeta(getFacetId({ id: facetId } as Facet))?.isDeleted

const newValueName = ref('')
const valueStates = computed(() => {
  return new Map(facetValues.value.map(fV => [
    fV.id,
    selectionState.value.has(fV.id) ? selectionState.value.get(fV.id) : 'none'],
  ))
})
const stateToColorMap = new Map([
  ['every', 'success'],
  ['some', 'warning'],
  ['none', 'neutral'],
])

function onAddValue() {
  if (!newValueName.value?.trim()) return
  dirtyFacetVList.addNewItem({ name: newValueName.value, facetId: facetId })
  newValueName.value = ''
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
        <span
          v-if="!isEditing || dirtyFacetVList.getMeta(facetV)?.isDeleted"
          class="self-center text-sm pl-2.5 text-highlighted"
          :class="{ 'text-muted line-through': dirtyFacetVList.getMeta(facetV)?.isDeleted }"
        >
          {{ dirtyFacetVList.getMeta(facetV)?.model }}
        </span>
        <UInput
          v-else
          :model-value="dirtyFacetVList.getMeta(facetV)?.model"
          variant="ghost"
          class="text-primary"
          @update:model-value="dirtyFacetVList.updateItem(facetV, $event)"
        />
      </UChip>
    </template>
    <template #actions="{ item: facetV }">
      <template v-if="isEditing && !isFacetDeleted()">
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
        v-if="!isEditing"
        icon="i-lucide-book-check"
        :color="stateToColorMap.get(valueStates.get(facetV.id))"
        :variant="selectionState.has(facetV.id) ? 'outline' : 'ghost'"
        title="(De-)Assign to selected products"
        aria-label="(De-)Assign to selected products"
        :disabled="!anySelected"
        @click="toggleValueState(facetV, valueStates.get(facetV.id))"
      />
    </template>
    <template
      v-if="isEditing && !isFacetDeleted()"
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
