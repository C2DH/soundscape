import { create } from 'zustand';
import type { GeoPoint } from './types';
import * as THREE from 'three';
import { parseColor } from './colors';

export const useStore = create<{
  currentParamItemId: string | null;
  setCurrentParamItemId: (itemId: string | null) => void;
  pathname: string;
  setPathname: (pathname: string) => void;
}>((set) => ({
  pathname: '/',
  setPathname: (pathname) => set(() => ({ pathname })),
  currentParamItemId: null,
  setCurrentParamItemId: (itemId: string | null) => set(() => ({ currentParamItemId: itemId })),
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
  refreshFromCSS: () => void;
  getColorVec3: (name: string) => THREE.Vector3 | undefined;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  colors: {
    '--color-primary': 'rgb(126,90,197)',
    '--light': 'rgb(249,241,228)',
    '--dark': 'rgb(28,14,50)',
    '--accent': 'rgb(255,222,124)',
    '--accent-3d': 'rgb(255,133,239)',
    '--accent-3d-time': 'rgb(95,255,242)',
  },
  threeColors: {
    '--color-primary': parseColor('126,90,197'),
    '--light': parseColor('249,241,228'),
    '--dark': parseColor('28,14,50'),
    '--accent': parseColor('255,222,124'),
    '--accent-3d': parseColor('255,133,239'),
    '--accent-3d-time': parseColor('95,255,242'),
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
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpenModal: false,
  openModal: () => set({ isOpenModal: true }),
  closeModal: () => set({ isOpenModal: false }),
}));

interface SidebarState {
  isOpenSidebar: boolean;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpenSidebar: false,
  toggleSidebar: () => set((state) => ({ isOpenSidebar: !state.isOpenSidebar })),
}));

type AudioState = {
  currentTime: number;
  duration: number;
  seekTime: number;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setSeekTime: (t: number) => void;
};

export const useAudioStore = create<
  AudioState & {
    audioRef: React.RefObject<HTMLAudioElement> | null;
  }
>((set) => ({
  currentTime: 0,
  seekTime: 0,
  duration: 1,
  audioRef: null,
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setSeekTime: (t) => set({ seekTime: t }),
}));

export const localSoundScapeStore = create<{
  highlightedVectors: THREE.Vector3[];
  highlightedLineIndex: number;
  lineTime: number;
  setHighlightedVectors: (
    highlightedVectors: THREE.Vector3[],
    highlightedLineIndex: number
  ) => void;
}>((set) => ({
  highlightedVectors: [],
  highlightedLineIndex: 0,
  lineTime: 0,
  setHighlightedVectors: (vectors: THREE.Vector3[], index: number) =>
    set({ highlightedVectors: vectors, highlightedLineIndex: index }),
}));

interface MeshState {
  mesh: THREE.Mesh | null;
  soundLines: THREE.Group | null;
  setMesh: (m: THREE.Mesh | null) => void;
  setSoundLines: (g: THREE.Group | null) => void;
}

export const useMeshStore = create<MeshState>((set) => ({
  mesh: null,
  soundLines: null,
  setMesh: (mesh) => set({ mesh }),
  setSoundLines: (soundLines) => set({ soundLines }),
}));

interface CameraState {
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  zoom: 0,
  setZoom: (zoom) => set({ zoom }),
}));

interface OrbitState {
  cameraPos: [number, number, number];
  target: [number, number, number];
  setOrbit: (pos: [number, number, number], target: [number, number, number]) => void;
}

export const useOrbitStore = create<OrbitState>((set) => ({
  cameraPos: [300, 200, 150],
  target: [0, 0, 0],
  setOrbit: (cameraPos, target) => set({ cameraPos, target }),
}));

// New: Scene UI / settings slice
interface SceneState {
  reversed: boolean;
  setReversed: (v: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  reversed: true,
  setReversed: (v: boolean) => set({ reversed: v }),
}));
