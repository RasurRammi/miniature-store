type TrackingValue<T> = {
  original: T
  model: T
  isNew: boolean
  isDeleted: boolean
}
export type DirtyStatus = 'unchanged' | 'new' | 'modified'
export type ValueMeta<T> = {
  model: T
  isDeleted: boolean
  status: DirtyStatus
}

export const useDirtyStateStore = defineStore('dirtyState', () => {
  const list = ref<Record<string, TrackingValue<any>>>({})

  function addToList(id: string, value: TrackingValue<any>) {
    list.value[id] = value
  }

  function removeFromList(id: string) {
    delete list.value[id]
  }

  function getValueMeta<T>(id: string): ValueMeta<T> | null {
    const trackingValue = list.value[id]
    if (!trackingValue) return null
    let status: DirtyStatus
    if (trackingValue.isNew) {
      status = 'new'
    }
    else if (trackingValue.model !== trackingValue.original) {
      status = 'modified'
    }
    else {
      status = 'unchanged'
    }
    return {
      model: trackingValue.model,
      isDeleted: trackingValue.isDeleted,
      status: status,
    }
  }

  function updateValue(id: string, newVal: any) {
    const trackingValue = list.value[id]
    if (!trackingValue) {
      return
    }
    trackingValue.model = newVal
  }

  function deleteValue(id: string) {
    const trackingValue = list.value[id]
    if (!trackingValue) {
      return
    }
    trackingValue.isDeleted = true
  }

  function restoreValue(id: string) {
    const trackingValue = list.value[id]
    if (!trackingValue) {
      return
    }
    trackingValue.isDeleted = false
  }

  function resetAll() {
    Object.keys(list.value).forEach((id) => {
      const entry = list.value[id]
      if (!entry) {
        return
      }
      if (entry.isNew) {
        delete list.value[id]
      }
      else {
        entry.model = entry.original
        entry.isDeleted = false
      }
    })
  }

  function getColorChip(id: string) {
    const val = getValueMeta(id)
    if (!val) return
    const colorMap: Record<DirtyStatus, string> = {
      unchanged: '',
      new: 'success',
      modified: 'warning',
    }
    return colorMap[val.status]
  }

  const totalChanges = computed(() =>
    Object.values(list.value).filter(v =>
      v.model !== v.original || v.isNew || v.isDeleted,
    ).length,
  )

  return { list, addToList, removeFromList, getValueMeta, updateValue, deleteValue, restoreValue, resetAll, getColorChip, totalChanges }
})
