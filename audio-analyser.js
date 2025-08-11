// audio-analysis.js
import fs from 'fs'
import { execSync } from 'child_process'
import decodeAudio from 'audio-decode'
import fft from 'fft-js'

const inputFile = process.argv[2]
const outputFile = process.argv[3]
const keepCount = parseInt(process.argv[4]) || 32 // number of frequency bins to keep from start
const intervalSeconds = parseFloat(process.argv[5]) || 0.25 // analysis interval

if (!inputFile || !outputFile) {
  console.error('Usage: node audio-analysis.js <input.mp3> <output.json>')
  process.exit(1)
}

const tempWav = 'temp.wav'

function extendArrays(data = []) {
  const extended = []
  const amplifiedData = amplifyArray(data, 2)
  for (let i = 0; i < amplifiedData.length - 1; i++) {
    extended.push(data[i])
    //   // Calculate midpoint
    const midpoint = (data[i] + data[i + 1]) / 2
    extended.push(midpoint)
  }
  extended.push(data[data.length - 1]) // Add last element
  return extended
}

function amplifyArray(arr, factor = 1) {
  // Apply a sqrt lscale to the array values
  return arr.map((value) => Math.pow(value, factor))
}

// Step 1: Convert MP3 → WAV using ffmpeg
execSync(`ffmpeg -y -i "${inputFile}" -ac 1 -ar 44100 "${tempWav}"`, {
  stdio: 'ignore',
})
console.log(`Analyzing: \x1b[1m${inputFile}\x1b[0m`)
console.log(`Output: \x1b[1m${outputFile}\x1b[0m`)
console.log(`Frequency bins: \x1b[1m${keepCount}\x1b[0m`)
console.log(`Interval seconds: \x1b[1m${intervalSeconds}\x1b[0m`)
// Step 2: Read WAV into buffer
const wavBuffer = fs.readFileSync(tempWav)

// Step 3: Decode WAV into AudioBuffer
decodeAudio(wavBuffer).then((audioBuffer) => {
  const channelData = audioBuffer.getChannelData(0) // Mono
  const sampleRate = audioBuffer.sampleRate
  const duration = audioBuffer.duration

  console.log(`Sample rate: ${sampleRate} Hz`)
  console.log(`Duration: ${duration.toFixed(2)} seconds`)
  console.log(`Total samples: ${channelData.length}`)

  const fftSize = 1024
  const halfFFT = fftSize / 2 // only positive frequencies
  const frequenciesPerSecond = []
  const numIntervals = Math.floor(duration / intervalSeconds)
  const samplesPerInterval = Math.floor(sampleRate * intervalSeconds)
  // Step 4: Process audio data in intervals

  for (let i = 0; i < numIntervals; i++) {
    const startSample = i * samplesPerInterval
    const endSample = Math.min(
      startSample + samplesPerInterval,
      channelData.length
    )
    const segment = channelData.slice(startSample, endSample)

    let intervalFFTData = []
    for (let j = 0; j < segment.length; j += fftSize) {
      const chunk = segment.slice(j, j + fftSize)
      const padded = new Float32Array(fftSize)
      padded.set(chunk)

      const phasors = fft.fft(padded)
      const magnitudes = fft.util.fftMag(phasors).slice(0, halfFFT)

      intervalFFTData.push(magnitudes)
    }

    // Average magnitudes for the interval
    const averaged = intervalFFTData[0].map(
      (_, idx) =>
        intervalFFTData.reduce((sum, arr) => sum + arr[idx], 0) /
        intervalFFTData.length
    )

    // add padding zeros
    const cropped = averaged.slice(0, keepCount)
    const padded = [0, ...cropped, 0]

    frequenciesPerSecond.push(extendArrays(padded))
  }

  // Step 5: Process audio data in seconds
  console.log(`Processing audio data in ${Math.floor(duration)} seconds...`)
  //   for (let sec = 0; sec < audioBuffer.duration; sec++) {
  //     const startSample = sec * sampleRate
  //     const endSample = Math.min((sec + 0.5) * sampleRate, channelData.length)
  //     const segment = channelData.slice(startSample, endSample)

  //     let secondFFTData = []
  //     for (let i = 0; i < segment.length; i += fftSize) {
  //       const chunk = segment.slice(i, i + fftSize)
  //       const padded = new Float32Array(fftSize)
  //       padded.set(chunk)

  //       const phasors = fft.fft(padded)
  //       const magnitudes = fft.util.fftMag(phasors).slice(0, fftSize)

  //       secondFFTData.push(magnitudes)
  //     }

  //     // Average magnitudes for the second
  //     const averaged = secondFFTData[0].map(
  //       (_, idx) =>
  //         secondFFTData.reduce((sum, arr) => sum + arr[idx], 0) /
  //         secondFFTData.length
  //     )

  //     // Keep only first N bins and add padding zeros
  //     const cropped = averaged.slice(0, keepCount)
  //     const padded = [0, ...cropped, 0]

  //     frequenciesPerSecond.push(padded)
  //   }

  // Step 4: Add a zero array at start and end
  const arrayLength = frequenciesPerSecond[0].length
  const zeroArray = Array(arrayLength).fill(0)

  const outputData = [zeroArray, ...frequenciesPerSecond, zeroArray]

  fs.writeFileSync(outputFile, JSON.stringify(outputData))
  console.log(`Frequencies saved to ${outputFile}`)
  fs.unlinkSync(tempWav)
})
