<script setup lang="ts">
import { UButton, UInput } from '#components'
import List from '~/components/common/List.vue'
import type { Facet, FacetValue } from '~/gql/admin/graphql'
import { getFacetId, getValueId, useDirtyList } from '~/composables/useDirtyList'

const facetValues = defineModel<FacetValue[]>({ required: true })
const { facetId, isEditing } = defineProps<{ facetId: string, isEditing: boolean }>()

const dirtyFacetVList = useDirtyList(facetValues, getValueId)
const isFacetDeleted = () => dirtyFacetVList.getValueMeta(getFacetId({ id: facetId } as Facet))?.isDeleted

const newValueName = ref('')

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
        icon="i-lucide-book-check"
        color="neutral"
        variant="ghost"
        aria-label="Assign to selected Products"
        @click="console.log('test')"
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
