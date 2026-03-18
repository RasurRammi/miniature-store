export default defineNuxtPlugin(() => {
  const router = useRouter()
  const drawerStack = useDrawerStack()

  router.beforeEach(() => {
    const topDrawer = drawerStack.peek()
    if (topDrawer) {
      topDrawer()
      return false
    }
  })
})
