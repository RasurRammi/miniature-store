export type ItemStatus = 'unchanged' | 'modified' | 'added'

export type Trackable<T> = T & { _status: ItemStatus, _markedDeleted: boolean }

export function useTrackedList<T extends { id?: string }>(original: T[]) {
  const items = ref<Trackable<T>[]>(
    original.map(item => ({ ...item, _status: 'unchanged' as ItemStatus, _markedDeleted: false })),
  )

  const isDirty = computed(() =>
    items.value.filter(item => item._status !== 'unchanged' || item._markedDeleted).length,
  )

  function addItem(item: T) {
    items.value.push({ ...item, _status: 'added', _markedDeleted: false })
  }

  function deleteItem(id: string) {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    if (item._status === 'added') {
      items.value = items.value.filter(i => i.id !== id)
    }
    else {
      item._markedDeleted = true
    }
  }

  function restoreItem(id: string) {
    const item = items.value.find(i => i.id === id)
    if (item) item._markedDeleted = false
  }

  function updateItem(id: string, key: keyof T, value: any) {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    item[key as any] = value

    const originalItem = original.find(o => o.id === id)
    if (originalItem) {
      const isUnchanged = Object.keys(originalItem).every(
        k => JSON.stringify(item[k as keyof T]) === JSON.stringify(originalItem[k as keyof T]),
      )
      item._status = isUnchanged ? 'unchanged' : 'modified'
    }
  }

  function reset() {
    items.value = original.map(item => ({ ...item, _status: 'unchanged' as ItemStatus, _markedDeleted: false }))
  }

  return { items, isDirty, updateItem, addItem, deleteItem, restoreItem, reset }
}
