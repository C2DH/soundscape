import { create } from 'zustand'

export const useStore = create<{
  currentParamItemId: string | undefined
  setCurrentParamItemId: (itemId: string | undefined) => void
}>((set) => ({
  currentParamItemId: undefined,
  setCurrentParamItemId: (itemId: string | undefined) =>
    set(() => ({ currentParamItemId: itemId })),
}))
