// audio-analysis.js
import fs from "fs";
import { execSync } from "child_process";
import decodeAudio from "audio-decode";
import fft from "fft-js";

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const keepCount = 15; // number of frequency bins to keep from start

if (!inputFile || !outputFile) {
    console.error("Usage: node audio-analysis.js <input.mp3> <output.json>");
    process.exit(1);
}

const tempWav = "temp.wav";

// Step 1: Convert MP3 → WAV using ffmpeg
execSync(`ffmpeg -y -i "${inputFile}" -ac 1 -ar 44100 "${tempWav}"`);

// Step 2: Read WAV into buffer
const wavBuffer = fs.readFileSync(tempWav);

// Step 3: Decode WAV into AudioBuffer
decodeAudio(wavBuffer).then(audioBuffer => {
    const channelData = audioBuffer.getChannelData(0); // Mono
    const sampleRate = audioBuffer.sampleRate;
    const fftSize = 512;
    const halfFFT = fftSize / 2; // only positive frequencies
    const frequenciesPerSecond = [];

    for (let sec = 0; sec < audioBuffer.duration; sec++) {
        const startSample = sec * sampleRate;
        const endSample = Math.min((sec + 0.5) * sampleRate, channelData.length);
        const segment = channelData.slice(startSample, endSample);

        let secondFFTData = [];
        for (let i = 0; i < segment.length; i += fftSize) {
            const chunk = segment.slice(i, i + fftSize);
            const padded = new Float32Array(fftSize);
            padded.set(chunk);

            const phasors = fft.fft(padded);
            const magnitudes = fft.util.fftMag(phasors).slice(0, fftSize);

            secondFFTData.push(magnitudes);
        }

        // Average magnitudes for the second
        const averaged = secondFFTData[0].map((_, idx) =>
            secondFFTData.reduce((sum, arr) => sum + arr[idx], 0) / secondFFTData.length
        );

        // Keep only first N bins and add padding zeros
        const cropped = averaged.slice(0, keepCount);
        const padded = [0, ...cropped, 0];

        frequenciesPerSecond.push(padded);
    }

    // Step 4: Add a zero array at start and end
    const arrayLength = frequenciesPerSecond[0].length;
    const zeroArray = Array(arrayLength).fill(0);

    const outputData = [zeroArray, ...frequenciesPerSecond, zeroArray];

    fs.writeFileSync(outputFile, JSON.stringify(outputData));
    console.log(`Frequencies saved to ${outputFile}`);
    fs.unlinkSync(tempWav);
});
