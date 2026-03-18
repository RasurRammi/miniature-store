const dirtyCounters = ref<Record<string, number>>({})

export function useUnsavedChanges() {
  function track(id: string, count: Ref<number>) {
    watchEffect(() => {
      dirtyCounters.value[id] = count.value
    })
  }

  function untrack(id: string) {
    delete dirtyCounters.value[id]
  }

  const totalUnsavedChanges = computed(() =>
    Object.values(dirtyCounters.value).reduce((sum, n) => sum + n, 0),
  )

  const hasUnsavedChanges = computed(() => totalUnsavedChanges.value > 0)

  return { track, untrack, totalUnsavedChanges, hasUnsavedChanges }
}
