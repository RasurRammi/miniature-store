<script setup lang="ts">
import { UButton, UInput } from '#components'
import type { Facet, FacetValue } from '~/gql/admin/graphql'
import { getFacetId, getValueId, useDirtyList } from '~/composables/useDirtyList'
import List from '~/components/common/List.vue'
import FacetValuesTable from '~/components/tags/FacetValuesTable.vue'

const facets = defineModel<Facet[]>({ required: true })
const { isEditing } = defineProps<{ isEditing: boolean }>()
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
        <span
          v-if="!isEditing || dirtyFacetList.getMeta(facet)?.isDeleted"
          class="self-center text-sm pl-2.5 text-highlighted"
          :class="{ 'text-muted line-through': dirtyFacetList.getMeta(facet)?.isDeleted }"
        >
          {{ dirtyFacetList.getMeta(facet)?.model }}
        </span>
        <UInput
          v-else
          :model-value="dirtyFacetList.getMeta(facet)?.model"
          variant="ghost"
          class="text-primary"
          @update:model-value="dirtyFacetList.updateItem(facet, $event)"
        />
      </UChip>
    </template>

    <template #actions="{ item: facet }">
      <template v-if="isEditing">
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
    </template>

    <template #expanded-content="{ item: facet }">
      <FacetValuesTable
        v-model="facet.values"
        :facet-id="facet.id"
        :is-editing="isEditing"
      />
    </template>

    <template
      v-if="isEditing"
      #add-row
    >
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
    <template #empty>
      <UEmpty
        v-if="!isEditing"
        title="No Tag groups exist yet. Edit the Tag groups to create new"
      />
    </template>
  </List>
</template>

<style scoped>

</style>
