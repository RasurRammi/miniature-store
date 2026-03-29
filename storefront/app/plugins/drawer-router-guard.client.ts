export default defineNuxtPlugin(() => {
  const router = useRouter()
  const drawerStack = useDrawerStack()

  router.beforeEach(() => {
    console.log(drawerStack)
    const topDrawer = drawerStack.peek()
    if (topDrawer) {
      topDrawer()
      return false
    }
  })
})
