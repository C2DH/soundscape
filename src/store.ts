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
      const primaryRgb = root.getPropertyValue('--color-primary').trim();
      const lightRgb = root.getPropertyValue('--light').trim();
      const darkRgb = root.getPropertyValue('--dark').trim();
      const accentRgb = root.getPropertyValue('--accent').trim();

      // Optional: read default alpha (or set 1)
      const alpha = root.getPropertyValue('--alpha')?.trim() || '1';
      return {
        colors: {
          '--color-primary': `rgba(${primaryRgb}, ${alpha})`,
          '--light': `rgba(${lightRgb}, ${alpha})`,
          '--dark': `rgba(${darkRgb}, ${alpha})`,
          '--accent': `rgba(${accentRgb}, ${alpha})`,
        },
      };
    }),
}));

interface ModalState {
  isOpenModal: boolean;
  toggleModal: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpenModal: false,
  toggleModal: () => set((state) => ({ isOpenModal: !state.isOpenModal })),
  openModal: () => set({ isOpenModal: true }),
  closeModal: () => set({ isOpenModal: false }),
}));

interface SidebarState {
  isOpenSidebar: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpenSidebar: false,
  toggleSidebar: () => set((state) => ({ isOpenSidebar: !state.isOpenSidebar })),
  openSidebar: () => set({ isOpenSidebar: true }),
  closeSidebar: () => set({ isOpenSidebar: false }),
}));
