import { Color } from 'three';

/**
 * Helper to convert a CSS rgb string (e.g. "255,0,0") into a THREE.Color instance.
 *
 * @param rgb - A string containing comma-separated RGB values (e.g. "255,0,0").
 * @returns A THREE.Color object representing the parsed color.
 */
export const parseColor = (rgb: string): Color => {
  const [r, g, b] = rgb.split(',').map((c) => parseFloat(c) / 255);
  return new Color(r, g, b);
};
