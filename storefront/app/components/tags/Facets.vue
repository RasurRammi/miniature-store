<script setup lang="ts">
import { useFacets } from '~/composables/admin/useFacets'
import { useSubmitFacets } from '~/composables/admin/useSubmitFacets'
import { getFacetId } from '~/composables/useDirtyList'
import FacetsTable from '~/components/tags/FacetsTable.vue'
import type { Facet } from '~/types/fragmentAliases'
import type { ProductSelectionContext } from '~/pages/admin/catalogue/tags.vue'

const toast = useToast()
const dirtyStateStore = useDirtyStateStore()
const { anySelected } = inject<ProductSelectionContext>('productSelection')!
const { data: facetsData } = useFacets()
const facetsCopy = ref<Facet[]>([])
const isEditingFacets = ref<boolean>(false)

watch(
  () => facetsData.value?.facets.items,
  (items) => {
    if (items) facetsCopy.value = structuredClone(toRaw(items))
  },
  { immediate: true },
)

const submitFacets = useSubmitFacets()
function submitChanges() {
  const inputs = []
  for (const f of facetsCopy.value) {
    const trueId = f.id.startsWith('new-') ? undefined : f.id
    const meta = dirtyStateStore.getValueMeta(getFacetId(f))
    if (!meta) continue
    if (meta.isDeleted) {
      // facet deleted, delete all children
      inputs.push({
        id: trueId,
        name: meta.model as string,
        isDirty: true,
        isDeleted: true,
        values: [], // automatically cascades to all children
      })
      continue
    }
    const dirtyValues = []
    for (const fV of f.values) {
      const vMeta = dirtyStateStore.getValueMeta(getValueId(fV))
      if (!vMeta || (vMeta.status === 'unchanged' && !vMeta.isDeleted)) continue
      const trueVId = fV.id.startsWith('new-') ? undefined : fV.id
      dirtyValues.push({
        id: trueVId,
        name: vMeta.model as string,
        isDeleted: trueVId ? vMeta.isDeleted : false,
      })
    }
    if (meta.status === 'unchanged' && !dirtyValues.length) continue
    inputs.push({
      id: trueId,
      name: meta.model as string,
      isDirty: meta.status !== 'unchanged',
      values: dirtyValues,
    })
  }
  console.debug('submit:', inputs)
  submitFacets.mutate(inputs, {
    onSuccess: () => {
      toast.add({
        title: 'All changes were successfully saved',
        color: 'success',
      })
    },
    onError: (err) => {
      toast.add({
        title: 'Failed creating facets',
        description: err.message,
        color: 'error',
      })
    },
  })
}

function resetChanges() {
  dirtyStateStore.resetAll()
  facetsCopy.value = facetsData.value
    ? structuredClone(toRaw(facetsData.value?.facets.items))
    : []
  toast.add({
    title: 'All changes were discarded',
    color: 'success',
  })
}
</script>

<template>
  <div>
    <div class="flex flex-row justify-center-safe items-center-safe p-2">
      <div />
      <div class="text-xl flex-1 text-center">
        Tag Groups
      </div>
      <UButton
        :icon="isEditingFacets ? 'i-lucide-pencil-off' : 'i-lucide-pencil'"
        variant="ghost"
        color="neutral"
        class="aspect-square"
        :disabled="anySelected || dirtyStateStore.totalChanges > 0"
        @click.prevent="isEditingFacets = !isEditingFacets"
      />
    </div>
    <FacetsTable
      v-model="facetsCopy"
      :is-editing="isEditingFacets"
    />

    <FloatingBar
      :total-changes="dirtyStateStore.totalChanges"
      @save="submitChanges()"
      @discard="resetChanges()"
    />
  </div>
</template>

<style scoped>

</style>
