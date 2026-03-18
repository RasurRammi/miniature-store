const stack: Array<() => void> = []

export function useDrawerStack() {
  return {
    push: (closeFn: () => void) => stack.push(closeFn),
    pop: () => stack.pop(),
    peek: () => stack[stack.length - 1],
    remove: (closeFn: () => void) => {
      const index = stack.indexOf(closeFn)
      if (index > -1) stack.splice(index, 1)
    },
  }
}

export function useDrawerState<T>() {
  const drawerStack = useDrawerStack()
  const isOpen = ref(false)
  const data = ref<T | null>(null)

  function open(payload?: T) {
    data.value = payload ?? null
    isOpen.value = true
    drawerStack.push(close)
  }

  function close() {
    isOpen.value = false
    drawerStack.remove(close)
  }

  function onAfterLeave() {
    data.value = null
  }

  return { isOpen, data, open, close, onAfterLeave }
}
