export type GeoPoint = {
  id?: string; // Optional ID for the point
  name?: string; // Optional name for the point
  url?: string; // Optional URL associated with the point
  lat: number; // in degrees
  lon: number; // in degrees
  color?: string;
};

/**
 * Represents an available audio item with location and resource information.
 */
export type AudioItem = {
  /** Unique identifier for the audio item */
  id: string;
  /** URL path associated with the audio item */
  url: string;
  /** Display name of the audio item */
  name: string;
  /** Latitude of the location */
  lat: number;
  /** Longitude of the location */
  lon: number;
  /** Path to the audio file */
  audioSrc: string;
  /** Path to the associated JSON data file */
  json: string;
  /** Description of the audio item */
  desc: string;
  /** Optional link for more information */
  link?: string;
}