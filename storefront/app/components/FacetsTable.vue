<script setup lang="ts">
import { UButton, UInput } from '#components'
import type { Facet, FacetValue } from '~/gql/admin/graphql'
import { getFacetId, getValueId, useDirtyList } from '~/composables/useDirtyList'
import List from '~/components/common/List.vue'

const facets = defineModel<Facet[]>({ required: true })
const dirtyFacetList = useDirtyList(facets, getFacetId)

const newFacetName = ref('')

function onAddFacet() {
  if (!newFacetName.value?.trim()) return
  dirtyFacetList.addNewItem({ name: newFacetName.value, values: [] as FacetValue[] })
  newFacetName.value = ''
}

function onDeleteFacet(facet: Facet) {
  dirtyFacetList.deleteItem(facet /* deleting values not necessary? */)
  // TODO only if not hard-deleted?
  facet.values.forEach(fV => dirtyFacetList.deleteValue(getValueId(fV)))
}

function onRestoreFacet(facet: Facet) {
  dirtyFacetList.restoreItem(facet)
  facet.values.forEach(fV => dirtyFacetList.restoreValue(getValueId(fV)))
}
</script>

<template>
  <List
    :items="facets"
    :item-class="(facet: Facet) => ({ 'opacity-50': dirtyFacetList.getMeta(facet)?.isDeleted })"
  >
    <template #default="{ item: facet }">
      <UChip
        position="top-left"
        inset
        :color="dirtyFacetList.getChipColor(facet)"
        size="xl"
        :show="!!dirtyFacetList.getChipColor(facet)"
      >
        <UInput
          v-if="!dirtyFacetList.getMeta(facet)?.isDeleted"
          :model-value="dirtyFacetList.getMeta(facet)?.model"
          variant="ghost"
          class="text-primary"
          @update:model-value="dirtyFacetList.updateItem(facet, $event)"
        />
        <span
          v-else
          class="self-center text-muted line-through pl-2"
        >
          {{ dirtyFacetList.getMeta(facet)?.model }}
        </span>
      </UChip>
    </template>

    <template #actions="{ item: facet }">
      <UButton
        v-if="dirtyFacetList.getMeta(facet)?.isDeleted"
        icon="i-lucide-undo"
        color="neutral"
        variant="ghost"
        @click="onRestoreFacet(facet)"
      />
      <UButton
        v-else
        icon="i-lucide-trash-2"
        color="primary"
        variant="ghost"
        @click="onDeleteFacet(facet)"
      />
    </template>

    <template #expanded-content="{ item: facet }">
      <FacetValuesTable
        v-model="facet.values"
        :facet-id="facet.id"
      />
    </template>

    <template #add-row>
      <UInput
        v-model="newFacetName"
        variant="ghost"
        placeholder="Add tag group..."
        @keydown.enter="onAddFacet"
      />
      <UButton
        icon="i-lucide-plus"
        color="primary"
        variant="ghost"
        @click="onAddFacet"
      />
    </template>
  </List>
</template>

<style scoped>

</style>
