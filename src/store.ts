import { create } from 'zustand';
import type { GeoPoint } from './types';
import * as THREE from 'three';

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
  colors: Record<string, string>; // still keep raw CSS strings
  threeColors: Record<string, THREE.Color>; // THREE.Color instances
  setColor: (name: string, value: string) => void;
  refreshFromCSS: () => void;
  getColorVec3: (name: string) => THREE.Vector3 | undefined;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  colors: {},
  threeColors: {},
  setColor: (name, value) => {
    const color = new THREE.Color(value); // convert to THREE.Color
    set((state) => ({
      colors: { ...state.colors, [name]: value },
      threeColors: { ...state.threeColors, [name]: color },
    }));
  },
  refreshFromCSS: () => {
    const root = getComputedStyle(document.documentElement);
    const primaryRgb = root.getPropertyValue('--color-primary').trim();
    const lightRgb = root.getPropertyValue('--light').trim();
    const darkRgb = root.getPropertyValue('--dark').trim();
    const accentRgb = root.getPropertyValue('--accent').trim();
    const accent3dRgb = root.getPropertyValue('--accent-3d').trim();
    const accent3dTimeRgb = root.getPropertyValue('--accent-3d-time').trim();

    const alpha = root.getPropertyValue('--alpha')?.trim() || '1';

    // Helper to convert CSS rgb string → THREE.Color
    const parseColor = (rgb: string) => {
      const [r, g, b] = rgb.split(',').map((c) => parseFloat(c) / 255);
      return new THREE.Color(r, g, b);
    };

    set(() => ({
      colors: {
        '--color-primary': `rgba(${primaryRgb}, ${alpha})`,
        '--light': `rgba(${lightRgb}, ${alpha})`,
        '--dark': `rgba(${darkRgb}, ${alpha})`,
        '--accent': `rgba(${accentRgb}, ${alpha})`,
        '--accent-3d': `rgba(${accent3dRgb}, ${alpha})`,
        '--accent-3d-time': `rgba(${accent3dTimeRgb}, ${alpha})`,
      },
      threeColors: {
        '--color-primary': parseColor(primaryRgb),
        '--light': parseColor(lightRgb),
        '--dark': parseColor(darkRgb),
        '--accent': parseColor(accentRgb),
        '--accent-3d': parseColor(accent3dRgb),
        '--accent-3d-time': parseColor(accent3dTimeRgb),
      },
    }));
  },
  getColorVec3: (name) => {
    const color = get().threeColors[name];
    return color ? new THREE.Vector3(color.r, color.g, color.b) : undefined;
  },
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

type AudioState = {
  currentTime: number;
  duration: number;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
};

export const useAudioStore = create<AudioState>((set) => ({
  currentTime: 0,
  duration: 1, // avoid div by zero
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
}));

export const localSoundScapeStore = create<{
  t: number;
  highlightedVectors: THREE.Vector3[];
  highlightedLineIndex: number;
  lineTime: number;
  lineTimeUpdatedByClick: boolean;
  setT: (t: number) => void;
  setLineTime: (time: number, byClick?: boolean) => void;
  setHighlightedVectors: (
    highlightedVectors: THREE.Vector3[],
    highlightedLineIndex: number
  ) => void;
}>((set) => ({
  t: 0,
  highlightedVectors: [],
  highlightedLineIndex: 0,
  lineTime: 0,
  lineTimeUpdatedByClick: false,
  setT: (t: number) => set(() => ({ t })),
  setHighlightedVectors: (vectors: THREE.Vector3[], index: number) =>
    set({ highlightedVectors: vectors, highlightedLineIndex: index }),
  setLineTime: (time: number, byClick: boolean = false) =>
    set({ lineTime: time, lineTimeUpdatedByClick: byClick }),
}));
