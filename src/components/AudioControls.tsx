import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import PlaySign from './svg/PlaySign';
import './AudioControls.css';
import PauseSign from './svg/PauseSign';
import NextVisSign from './svg/NextVisSign';
import NextCountrySign from './svg/NextCountrySign';
import { useAudioStore } from '../store';

type AudioControlsProps = {
  onNextVis: () => void;
  onPrevVis: () => void;
  onNextCountry: () => void;
  onPrevCountry: () => void;
  onTimeUpdate?: (time: number) => void; // NEW
  onDuration?: (duration: number) => void; // NEW
  src?: string; // NEW
};

const AudioControls: FC<AudioControlsProps> = ({
  onNextVis,
  onPrevVis,
  onNextCountry,
  onPrevCountry,
  src = '',
}) => {
  const { currentTime, duration, setCurrentTime, setDuration } = useAudioStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (time: number) => time.toFixed(2);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => setDuration(audio.duration);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', updateTime);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [setCurrentTime, setDuration]);

  const handleToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  // Sync audio element with isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <nav
      className="AudioControls absolute bottom-[10%] left-[calc(50%-100px)] flex flex-col items-center justify-center gap-1 z-50"
      aria-label="Audio controls"
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="auto" loop />

      <div className="button-group flex items-center justify-center gap-6">
        {/* Previous catalogue */}
        <button onClick={onPrevCountry} aria-label="Previous catalogue">
          <NextCountrySign className="transform rotate-180" />
        </button>

        {/* Previous song */}
        <button onClick={onPrevVis} aria-label="Previous song">
          <NextVisSign className="transform rotate-180 mr-2" />
        </button>

        {/* Play / Pause toggle */}
        {isPlaying ? (
          <button className="no-opacity" onClick={handleToggle} aria-label="Pause">
            <PauseSign />
          </button>
        ) : (
          <button className="no-opacity" onClick={handleToggle} aria-label="Play">
            <PlaySign />
          </button>
        )}

        {/* Next song */}
        <button onClick={onNextVis} aria-label="Next song">
          <NextVisSign />
        </button>

        {/* Next catalogue */}
        <button onClick={onNextCountry} aria-label="Next catalogue">
          <NextCountrySign />
        </button>
      </div>

      {/* Optional: duration/time display */}
      <span className="duration">
        {formatTime(duration)} / {formatTime(currentTime)}
      </span>
    </nav>
  );
};

export default AudioControls;
