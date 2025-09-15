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
    audioSrc: '/audio/Norway.mp3',
    json: '/data/norway.json',
  },
  {
    id: 'island',
    url: '/island',
    name: 'Island',
    lat: 64.9631,
    lon: -19.0208,
    audioSrc: '/audio/Island.mp3',
    json: '/data/iceland.json',
  },
  {
    id: 'italy',
    url: '/italy',
    name: 'Italy',
    lat: 41.8719,
    lon: 12.5674,
    audioSrc: '/audio/Italy.mp3',
    json: '/data/italy.json',
  },
  {
    id: 'netherlands',
    url: '/netherlands',
    name: 'Netherlands',
    lat: 52.3676,
    lon: 4.9041,
    audioSrc: '/audio/Netherlands.mp3',
    json: '/data/netherlands.json',
  },
  {
    id: 'poland',
    url: '/poland',
    name: 'Poland',
    lat: 51.9194,
    lon: 19.1451,
    audioSrc: '/audio/Poland.mp3',
    json: '/data/poland.json',
  },
  {
    id: 'czechia',
    url: '/czechia',
    name: 'Czechia',
    lat: 49.8175,
    lon: 15.473,
    audioSrc: '/audio/Czechia.mp3',
    json: '/data/czechia.json',
  },
  {
    id: 'austria',
    url: '/austria',
    name: 'Austria',
    lat: 47.3681,
    lon: 13.7369,
    audioSrc: '/audio/Austria.mp3',
    json: '/data/austria.json',
  },
  {
    id: 'germany',
    url: '/germany',
    name: 'Germany',
    lat: 51.1657,
    lon: 10.4515,
    audioSrc: '/audio/Germany.mp3',
    json: '/data/germany.json',
  },
  {
    id: 'hungary',
    url: '/hungary',
    name: 'Hungary',
    lat: 47.1625,
    lon: 19.5033,
    audioSrc: '/audio/Hungary.mp3',
    json: '/data/hungary.json',
  },
  {
    id: 'netherlands',
    url: '/netherlands',
    name: 'Netherlands',
    lat: 52.3676,
    lon: 4.9041,
    audioSrc: '/audio/Netherlands.mp3',
    json: '/data/netherlands.json',
  },
  {
    id: 'norway',
    url: '/norway',
    name: 'Norway',
    lat: 60.472,
    lon: 8.4689,
    audioSrc: '/audio/Norway.mp3',
    json: '/data/norway.json',
  },
  {
    id: 'switzerland',
    url: '/switzerland',
    name: 'Switzerland',
    lat: 46.8182,
    lon: 8.2275,
    audioSrc: '/audio/Switzerland.mp3',
    json: '/data/switzerland.json',
  },
];
