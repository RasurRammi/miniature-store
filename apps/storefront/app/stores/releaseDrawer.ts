import type { Collection } from '~/gql/shop/graphql'

export const useReleaseDrawerStore = defineStore('releaseDrawer', () => {
  const { isOpen, data: release, updateData, open, close, onAfterLeave } = useDrawerState<Collection>()
  return { isOpen, release, updateData, open, close, onAfterLeave }
})
