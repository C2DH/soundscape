/**
 * Extracts frequency data from an MP3 file URL
 * @param mp3Url - URL of the MP3 file
 * @param fftSize - FFT size for frequency analysis (default: 256)
 * @returns Array of frequency arrays (one per second)
 */
export async function extractFrequencyLists(
  mp3Url: string,
  fftSize: number = 256
): Promise<number[][]> {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Fetch and decode audio file
    const response = await fetch(mp3Url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Get audio data
    const channelData = audioBuffer.getChannelData(0); // Use first channel
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    // Calculate samples per second
    const samplesPerSecond: number = sampleRate;
    const lists: number[][] = [];

    // Process audio data second by second
    for (let second: number = 0; second < Math.floor(duration); second++) {
      const startSample: number = second * samplesPerSecond;
      const endSample: number = Math.min(startSample + samplesPerSecond, channelData.length);

      // Extract one second of audio data
      const secondData: Float32Array = channelData.slice(startSample, endSample);

      // Perform FFT analysis
      const frequencies: number[] = performFFT(secondData, fftSize);

      lists.push(frequencies);
    }

    return lists;
  } catch (error) {
    console.error('Error extracting frequency data:', error);
    throw error;
  }
}

/**
 * Performs FFT analysis on audio data
 * @param audioData - Audio samples
 * @param fftSize - FFT size
 * @returns Frequency magnitudes
 */
function performFFT(audioData: Float32Array, fftSize: number): number[] {
  // Pad or truncate audio data to match FFT size
  const paddedData = new Float32Array(fftSize);
  const copyLength = Math.min(audioData.length, fftSize);
  paddedData.set(audioData.slice(0, copyLength));

  // Simple FFT implementation (you might want to use a more sophisticated library)
  const frequencies: number[] = [];
  const frequencyBinCount: number = fftSize / 2;

  for (let k = 0; k < frequencyBinCount; k++) {
    let realSum = 0;
    let imagSum = 0;

    for (let n = 0; n < fftSize; n++) {
      const angle = (-2 * Math.PI * k * n) / fftSize;
      realSum += paddedData[n] * Math.cos(angle);
      imagSum += paddedData[n] * Math.sin(angle);
    }

    // Calculate magnitude
    const magnitude = Math.sqrt(realSum * realSum + imagSum * imagSum);
    frequencies.push(magnitude);
  }

  return frequencies;
}

// Alternative implementation using Web Audio API's AnalyserNode (more efficient)
export async function extractFrequencyListsWithAnalyser(
  mp3Url: string,
  fftSize: number = 256
): Promise<number[][]> {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Fetch and decode audio
    const response = await fetch(mp3Url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create offline audio context for analysis
    const offlineContext = new OfflineAudioContext(
      1, // mono
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Create analyser node
    const analyser = offlineContext.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = 0;

    // Create buffer source
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(offlineContext.destination);

    const lists: number[][] = [];
    // const frequencyBinCount: number = analyser.frequencyBinCount
    const sampleRate: number = audioBuffer.sampleRate;
    const samplesPerSecond: number = sampleRate;

    // Process audio in 1-second chunks
    for (let second: number = 0; second < Math.floor(audioBuffer.duration); second++) {
      // This is a simplified approach - in practice, you'd need to
      // process the audio buffer in real-time chunks
      const startSample: number = second * samplesPerSecond;
      const channelData: Float32Array = audioBuffer.getChannelData(0);
      const secondData: Float32Array = channelData.slice(
        startSample,
        startSample + samplesPerSecond
      );

      // Convert to frequency domain
      const frequencies: number[] = performFFT(secondData, fftSize);

      // Normalize to 0-255 range (similar to AnalyserNode output)
      const normalizedFrequencies: number[] = frequencies.map((f: number) =>
        Math.min(255, f * 255)
      );

      lists.push(normalizedFrequencies);
    }

    return lists;
  } catch (error) {
    console.error('Error extracting frequency data:', error);
    throw error;
  }
}

// Usage example:
/*
const mp3Url: string = 'path/to/your/audio.mp3';
extractFrequencyLists(mp3Url, 256)
  .then((lists: number[][]) => {
    console.log('Frequency data:', lists);
    // Now you can pass 'lists' to your SoundScape component
    // <SoundScape lists={lists} showWireframe={false} />
  })
  .catch((error: Error) => {
    console.error('Failed to extract frequency data:', error);
  });
*/

/**
 * Formats a time value (in seconds) into a string with seconds and milliseconds.
 *
 * The output string is in the format `SS:MM`, where `SS` is the zero-padded seconds
 * and `MM` is the zero-padded milliseconds (calculated as a fraction of a second, scaled to 60).
 *
 * @param time - The time value in seconds (can be fractional).
 * @returns A formatted string representing the time in `SS:MM` format.
 *
 * @example
 * ```typescript
 * formatTime(12.5); // "12:30"
 * formatTime(3.01); // "03:00"
 * ```
 */
export const formatTime = (time: number) => {
  const seconds = Math.floor(time);
  const milliseconds = Math.floor((time - seconds) * 60);
  return `${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};
