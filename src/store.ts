import { create } from 'zustand';
import type { GeoPoint } from './types';

export const useStore = create<{
  currentParamItemId: string | undefined;
  setCurrentParamItemId: (itemId: string | undefined) => void;
}>((set) => ({
  currentParamItemId: undefined,
  setCurrentParamItemId: (itemId: string | undefined) =>
    set(() => ({ currentParamItemId: itemId })),
}));

export const useWorldStore = create<{
  geoPoints: GeoPoint[];
  // Function to set geoPoints, which can be used to update the state
  // This function can be used in components to update the list of geoPoints
  setGeoPoints: (points: GeoPoint[]) => void;
  highlightedPoint?: GeoPoint;
  setHighlightedPoint: (point: GeoPoint | undefined) => void;
}>((set) => ({
  geoPoints: [],
  setGeoPoints: (geoPoints) => set(() => ({ geoPoints })),
  highlightedPoint: undefined,
  setHighlightedPoint: (point) => set(() => ({ highlightedPoint: point })),
}));

interface ThemeState {
  colors: Record<string, string>;
  setColor: (name: string, value: string) => void;
  refreshFromCSS: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  colors: {},
  setColor: (name, value) =>
    set((state) => ({
      colors: { ...state.colors, [name]: value },
    })),
  refreshFromCSS: () =>
    set(() => {
      const root = getComputedStyle(document.documentElement);
      const primary = root.getPropertyValue('--color-primary').trim();
      const light = root.getPropertyValue('--light').trim();
      const dark = root.getPropertyValue('--dark').trim();
      return {
        colors: {
          '--color-primary': primary,
          '--light': light,
          '--dark': dark,
        },
      };
    }),
}));
