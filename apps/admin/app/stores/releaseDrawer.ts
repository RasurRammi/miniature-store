import type { Collection } from '~/gql/graphql'
import {useDrawerState} from "@miniature-store/shared/stores";

export const useReleaseDrawerStore = defineStore('releaseDrawer', () => {
  const { isOpen, data: release, updateData, open, close, onAfterLeave } = useDrawerState<Collection>()
  return { isOpen, release, updateData, open, close, onAfterLeave }
})
