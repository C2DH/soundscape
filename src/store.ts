import { create } from 'zustand'
import type { GeoPoint } from './types'

export const useStore = create<{
  currentParamItemId: string | undefined
  setCurrentParamItemId: (itemId: string | undefined) => void
}>((set) => ({
  currentParamItemId: undefined,
  setCurrentParamItemId: (itemId: string | undefined) =>
    set(() => ({ currentParamItemId: itemId })),
}))

export const useWorldStore = create<{
  geoPoints: GeoPoint[]
  // Function to set geoPoints, which can be used to update the state
  // This function can be used in components to update the list of geoPoints
  setGeoPoints: (points: GeoPoint[]) => void
  highlightedPoint?: GeoPoint
  setHighlightedPoint: (point: GeoPoint | undefined) => void
}>((set) => ({
  geoPoints: [],
  setGeoPoints: (geoPoints) => set(() => ({ geoPoints })),
  highlightedPoint: undefined,
  setHighlightedPoint: (point) => set(() => ({ highlightedPoint: point })),
}))
