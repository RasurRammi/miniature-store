const stack: Array<() => void> = []

export function useDrawerStack() {
  return {
    push: (closeFn: () => void) => {
      console.log('pushed', closeFn)
      stack.push(closeFn)
    },
    pop: () => stack.pop(),
    peek: () => stack[stack.length - 1],
    remove: (closeFn: () => void) => {
      const index = stack.indexOf(closeFn)
      console.log('removed', closeFn, index)
      if (index > -1) stack.splice(index, 1)
    },
  }
}

export function useDrawerState<T extends { id: string }>() {
  const drawerStack = useDrawerStack()
  const isOpen = ref(false)
  const data = ref<T | null>(null)

  function updateData(payload: T) {
    if (!isOpen.value) return
    data.value = payload
  }

  function open(payload?: T) {
    if (data.value && payload && data.value.id === payload.id) return
    data.value = payload ?? null
    isOpen.value = true
    drawerStack.push(close)
  }

  function close() {
    isOpen.value = false
  }

  function onAfterLeave() {
    data.value = null
    drawerStack.remove(close)
  }

  return { isOpen, data, updateData, open, close, onAfterLeave }
}
