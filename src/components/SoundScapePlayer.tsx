import { Canvas } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import SoundScape from './SoundScape'
import { OrbitControls } from '@react-three/drei'
import { extractFrequencyListsWithAnalyser } from '../audio'

export async function fetchMP3AsAudioBuffer(url: string): Promise<AudioBuffer> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()

  const audioContext = new AudioContext()
  return await audioContext.decodeAudioData(arrayBuffer)
}

export function getMonoChannelData(audioBuffer: AudioBuffer): Float32Array {
  const channelLeft = audioBuffer.getChannelData(0)
  const isStereo = audioBuffer.numberOfChannels > 1
  const channelRight = isStereo ? audioBuffer.getChannelData(1) : channelLeft

  const length = audioBuffer.length
  const mono = new Float32Array(length)

  for (let i = 0; i < length; i++) {
    mono[i] = (channelLeft[i] + channelRight[i]) / 2
  }

  return mono
}

export function extractListsFromAudioBuffer(
  audioBuffer: AudioBuffer
): number[][] {
  const channelData = getMonoChannelData(audioBuffer)
  const sampleRate = audioBuffer.sampleRate
  const totalSeconds = Math.floor(audioBuffer.duration)
  const samplesPerSecond = sampleRate
  const lists: number[][] = []

  for (let second = 0; second < totalSeconds; second++) {
    const startSample = second * samplesPerSecond
    const endSample = startSample + samplesPerSecond
    const segment = channelData.slice(startSample, endSample)

    const samplesPerSegment = 10
    const step = Math.floor(segment.length / samplesPerSegment)
    const yValues: number[] = []

    for (let i = 0; i < samplesPerSegment; i++) {
      const start = i * step
      const end = start + step
      const window = segment.slice(start, end)
      const avg =
        window.reduce((sum, val) => sum + Math.abs(val), 0) / window.length
      yValues.push(avg * 10) // scale amplitude
    }

    lists.push(yValues)
  }

  return lists
}

type Props = {
  url: string
}

/**
 * Amplifies the amplitude values in a soundscape list.
 * @param lists - 2D array of Y values (one array per second)
 * @param factor - Multiplier for amplitude (default is 1)
 * @returns A new amplified list
 */
export function amplifyLists(
  lists: number[][],
  factor: number = 1
): number[][] {
  return lists.map((row) => row.map((y) => Math.pow(y, factor)))
}

export const SoundScapePlayer: React.FC<Props> = ({ url }) => {
  const [lists, setLists] = useState<number[][]>([])
  const [duration, setDuration] = useState(0)
  const [currentSecond, setCurrentSecond] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const load = async () => {
      const buffer = await fetchMP3AsAudioBuffer(url)
      const lists = await extractFrequencyListsWithAnalyser(url, 128)
      console.log('Extracted lists:', lists)
      setLists(amplifyLists(lists, 0.5)) // Amplify the soundscape
      setDuration(Math.floor(buffer.duration))
    }
    load()
  }, [url])

  // Sync current playback second
  useEffect(() => {
    const update = () => {
      if (audioRef.current) {
        setCurrentSecond(Math.floor(audioRef.current.currentTime))
      }
      animationRef.current = requestAnimationFrame(update)
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(update)
    } else {
      cancelAnimationFrame(animationRef.current!)
    }

    return () => cancelAnimationFrame(animationRef.current!)
  }, [isPlaying])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const second = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = second
    }
    setCurrentSecond(second)
  }

  // const visibleLists = lists.slice(0, currentSecond + 1)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <audio ref={audioRef} src={url} preload='auto' />
      <div style={{ padding: 12, background: '#111', color: '#fff' }}>
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        <input
          type='range'
          min={0}
          max={duration}
          value={currentSecond}
          onChange={onSeek}
          style={{ width: '50%', marginLeft: 16 }}
        />
        <span style={{ marginLeft: 8 }}>
          {currentSecond}s / {duration}s
        </span>
      </div>
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.1, 0]}
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        <SoundScape lists={lists} showWireframe={true} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
