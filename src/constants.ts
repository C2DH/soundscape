/**
 * Represents an available audio item with location and resource information.
 */
export interface AudioItem {
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
}

/**
 * List of available audio items with their metadata.
 */
export const AvailableAudioItems: AudioItem[] = [
  {
    id: 'denmark',
    url: '/denmark',
    name: 'Denmark',
    lat: 56.2639,
    lon: 9.5018,
    audioSrc: '/audio/Denmark.mp3',
    json: '/data/denmark.json',
  },
  {
    id: 'sweden',
    url: '/sweden',
    name: 'Sweden',
    lat: 60.1282,
    lon: 18.6435,
    audioSrc: '/audio/Sweden.mp3',
    json: '/data/sweden.json',
  },
  {
    id: 'norway',
    url: '/norway',
    name: 'Norway',
    lat: 60.472,
    lon: 8.4689,
    audioSrc: '/audio/norway.mp3',
    json: '/data/norway.json',
  },
  {
    id: 'luxembourg',
    url: '/luxembourg',
    name: 'Luxembourg',
    lat: 49.6118,
    lon: 6.1319,
    audioSrc: '/audio/luxembourg.mp3',
    json: '/data/luxembourg.json',
  },
  {
    id: 'finland',
    url: '/finland',
    name: 'Finland',
    lat: 61.9241,
    lon: 25.7482,
    audioSrc: '/audio/finland.mp3',
    json: '/data/finland.json',
  },
  {
    id: 'iceland',
    url: '/iceland',
    name: 'Iceland',
    lat: 64.9631,
    lon: -19.0208,
    audioSrc: '/audio/iceland.mp3',
    json: '/data/iceland.json',
  },
  {
    id: 'italy',
    url: '/italy',
    name: 'Italy',
    lat: 41.8719,
    lon: 12.5674,
    audioSrc: '/audio/italy.mp3',
    json: '/data/italy.json',
  },
  {
    id: 'spain',
    url: '/spain',
    name: 'Spain',
    lat: 40.4637,
    lon: -3.7492,
    audioSrc: '/audio/spain.mp3',
    json: '/data/spain.json',
  },
  {
    id: 'portugal',
    url: '/portugal',
    name: 'Portugal',
    lat: 39.3999,
    lon: -8.2245,
    audioSrc: '/audio/portugal.mp3',
    json: '/data/portugal.json',
  },
  {
    id: 'belgium',
    url: '/belgium',
    name: 'Belgium',
    lat: 50.5039,
    lon: 4.4699,
    audioSrc: '/audio/belgium.mp3',
    json: '/data/belgium.json',
  },
  {
    id: 'netherlands',
    url: '/netherlands',
    name: 'Netherlands',
    lat: 52.3676,
    lon: 4.9041,
    audioSrc: '/audio/netherlands.mp3',
    json: '/data/netherlands.json',
  },
  {
    id: 'poland',
    url: '/poland',
    name: 'Poland',
    lat: 51.9194,
    lon: 19.1451,
    audioSrc: '/audio/poland.mp3',
    json: '/data/poland.json',
  },
];
