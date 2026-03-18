<script setup lang="ts">
import { UButton, UDropdownMenu, UInput } from '#components'
import type { Facet } from '~/gql/admin/graphql'
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'
import { useDirtyStateStore } from '#imports'
import List from '~/components/common/List.vue'
import type { FacetValue } from '~/gql/shop/graphql'

const facets = defineModel<Facet[]>({ required: true })

const { addToList, removeFromList, getValueMeta, updateValue, getColorChip, deleteValue, restoreValue } = useDirtyStateStore()

function getFacetId(facet: Facet) {
  return `Facet:${facet.id}`
}

onMounted(() => {
  facets.value.forEach(facet => addToList(getFacetId(facet), {
    original: facet.name,
    model: facet.name,
    isNew: false,
    isDeleted: false,
  }))
})
onUnmounted(() => {
  facets.value.forEach(facet => removeFromList(getFacetId(facet)))
})
function getDropdownActions(facet: Facet): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Noch keine Idee für Aktionen hier',
        icon: 'i-lucide-book-check',
        onSelect: () => {
          console.log('tag group selected')
        },
      },
    ],
  ]
}

const newFacetName = ref('')
let newFacetCounter = 0

function onAddFacet() {
  if (!newFacetName.value?.trim()) return
  const newFacet = {
    id: `new-${newFacetCounter++}`,
    name: newFacetName.value,
    code: '',
    values: [] as FacetValue[],
  } as Facet
  facets.value.push(newFacet)
  addToList(getFacetId(newFacet), {
    original: newFacet.name,
    model: newFacet.name,
    isNew: true,
    isDeleted: false,
  })
  newFacetName.value = ''
}

function deleteFacet(facet: Facet) {
  if (facet.id.startsWith('new-')) {
    // remove completely
    facets.value = facets.value.filter(f => f.id !== facet.id)
    removeFromList(getFacetId(facet))
  }
  else {
    // mark as removed
    deleteValue(getFacetId(facet))
    facet.values.forEach(facetV => deleteValue(`FacetValue:${facetV.id}`))
  }
}

function restoreFacet(facet: Facet) {
  restoreValue(getFacetId(facet))
  facet.values.forEach(facetV => restoreValue(`FacetValue:${facetV.id}`))
}
</script>

<template>
  <List
    :items="facets"
    :item-class="(facet) => ({ 'opacity-50 line-through': getValueMeta(getFacetId(facet))?.isDeleted })"
  >
    <template #default="{ item: facet }">
      <UChip
        position="top-left"
        inset
        :color="getColorChip(getFacetId(facet))"
        size="xl"
        :show="!!getColorChip(getFacetId(facet))"
      >
        <UInput
          v-if="!getValueMeta(getFacetId(facet))?.isDeleted"
          :model-value="getValueMeta(getFacetId(facet))?.model"
          variant="ghost"
          class="text-primary"
          @update:model-value="updateValue(getFacetId(facet), $event)"
        />
        <span
          v-else
          class="self-center text-muted pl-2"
        >
          {{ getValueMeta(getFacetId(facet))?.model }}
        </span>
      </UChip>
    </template>

    <template #actions="{ item: facet }">
      <UButton
        v-if="getValueMeta(getFacetId(facet))?.isDeleted"
        icon="i-lucide-undo"
        color="neutral"
        variant="ghost"
        @click="restoreFacet(facet)"
      />
      <UButton
        v-else
        icon="i-lucide-trash-2"
        color="primary"
        variant="ghost"
        @click="deleteFacet(facet)"
      />
      <UDropdownMenu :items="getDropdownActions(facet)">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu>
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
