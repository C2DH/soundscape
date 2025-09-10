// audio-analysis.js
import fs from 'fs';
import { execSync } from 'child_process';
import decodeAudio from 'audio-decode';
import fft from 'fft-js';

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const keepCount = parseInt(process.argv[4]) || 48; // number of frequency bins to keep from start
const numChunks = parseInt(process.argv[5]) || 200; // total frequency arrays to generate

if (!inputFile || !outputFile) {
  console.error('Usage: node audio-analysis.js <input.mp3> <output.json> [keepCount] [numChunks]');
  process.exit(1);
}

const tempWav = 'temp.wav';

function extendArrays(data = []) {
  const extended = [];
  const amplifiedData = amplifyArray(data, 2);
  for (let i = 0; i < amplifiedData.length - 1; i++) {
    extended.push(data[i]);
    const midpoint = (data[i] + data[i + 1]) / 2;
    extended.push(midpoint);
  }
  extended.push(data[data.length - 1]);
  return extended;
}

function amplifyArray(arr, factor = 1) {
  return arr.map((value) => Math.pow(value, factor));
}

// Step 1: Convert MP3 → WAV using ffmpeg
execSync(`ffmpeg -y -i "${inputFile}" -ac 1 -ar 44100 "${tempWav}"`, { stdio: 'ignore' });
console.log(`Analyzing: \x1b[1m${inputFile}\x1b[0m`);
console.log(`Output: \x1b[1m${outputFile}\x1b[0m`);
console.log(`Frequency bins: \x1b[1m${keepCount}\x1b[0m`);
console.log(`Total chunks: \x1b[1m${numChunks}\x1b[0m`);

// Step 2: Read WAV into buffer
const wavBuffer = fs.readFileSync(tempWav);

// Step 3: Decode WAV into AudioBuffer
decodeAudio(wavBuffer).then((audioBuffer) => {
  const channelData = audioBuffer.getChannelData(0); // Mono
  const sampleRate = audioBuffer.sampleRate;
  const totalSamples = channelData.length;

  console.log(`Sample rate: ${sampleRate} Hz`);
  console.log(`Total samples: ${totalSamples}`);

  const fftSize = 1024;
  const halfFFT = fftSize / 2; // only positive frequencies
  const frequenciesPerChunk = [];

  const samplesPerChunk = Math.floor(totalSamples / numChunks);

  for (let i = 0; i < numChunks; i++) {
    const startSample = i * samplesPerChunk;
    const endSample = i === numChunks - 1 ? totalSamples : (i + 1) * samplesPerChunk;
    const segment = channelData.slice(startSample, endSample);

    let chunkFFTData = [];
    for (let j = 0; j < segment.length; j += fftSize) {
      const chunk = segment.slice(j, j + fftSize);
      const padded = new Float32Array(fftSize);
      padded.set(chunk);

      const phasors = fft.fft(padded);
      const magnitudes = fft.util.fftMag(phasors).slice(0, halfFFT);

      chunkFFTData.push(magnitudes);
    }

    // Average magnitudes for the chunk
    const averaged = chunkFFTData[0].map(
      (_, idx) => chunkFFTData.reduce((sum, arr) => sum + arr[idx], 0) / chunkFFTData.length
    );

    const cropped = averaged.slice(0, keepCount);
    const padded = [0, ...cropped, 0];

    frequenciesPerChunk.push(extendArrays(padded));
  }

  // Add zero array at start and end
  const arrayLength = frequenciesPerChunk[0].length;
  const zeroArray = Array(arrayLength).fill(0);
  const outputData = [zeroArray, ...frequenciesPerChunk, zeroArray];

  fs.writeFileSync(outputFile, JSON.stringify(outputData));
  console.log(`Frequencies saved to ${outputFile}`);
  fs.unlinkSync(tempWav);
});
