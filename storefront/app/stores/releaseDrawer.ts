import type { Collection } from '~/gql/shop/graphql'

export const useReleaseDrawerStore = defineStore('releaseDrawer', () => {
  const { isOpen, data: release, open, close, onAfterLeave } = useDrawerState<Collection>()
  return { isOpen, release, open, close, onAfterLeave }
})
