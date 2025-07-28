// AudioPlayer.tsx
import React, { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  src: string
  seek: number
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, seek }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = seek
      if (!isPlaying) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [seek])

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div>
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
      <button onClick={isPlaying ? handlePause : handlePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  )
}

export default AudioPlayer
