import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import PlaySign from './svg/PlaySign';
import './AudioControls.css';
import PauseSign from './svg/PauseSign';
import NextVisSign from './svg/NextVisSign';
import NextCountrySign from './svg/NextCountrySign';
import { useAudioStore, localSoundScapeStore } from '../store';
// import { formatTime } from '../audio';
import AudioControlsProgress from './AudioControlsProgress';

type AudioControlsProps = {
  onNextVis: () => void;
  onPrevVis: () => void;
  onNextCountry: () => void;
  onPrevCountry: () => void;
  onTimeUpdate?: (time: number) => void; // NEW
  onDuration?: (duration: number) => void; // NEW
  src?: string; // NEW
  playlistIdx?: number; // NEW -1 means no playlist
  playListLength?: number; // NEW total items in playlist
};

const AudioControls: FC<AudioControlsProps> = ({
  onNextVis,
  onPrevVis,
  onNextCountry,
  onPrevCountry,
  src = '',
  playlistIdx = -1,
  playListLength = 0,
}) => {
  const setCurrentTime = useAudioStore((s) => s.setCurrentTime);
  const setDuration = useAudioStore((s) => s.setDuration);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('AudioControls render', { playlistIdx, playListLength });
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

  useEffect(() => {
    let prevCount = localSoundScapeStore.getState().clickCounter;
    const unsubscribe = localSoundScapeStore.subscribe((s) => {
      if (s.clickCounter > prevCount && audioRef.current) {
        const { lineTime } = s;
        audioRef.current.currentTime = lineTime; // jump playback
        setCurrentTime(lineTime); // update store so lines update immediately
      }
      prevCount = s.clickCounter;
    });
    return () => unsubscribe();
  }, [setCurrentTime]);

  // Sync audio element with isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.load();
      setIsPlaying(false); // reset to paused when source changes
      setCurrentTime(0); // reset time
    }
  }, [src]);

  return (
    <nav
      className="AudioControls absolute bottom-[10%] left-[calc(50%-100px)] flex flex-col items-center justify-center gap-1 z-50"
      aria-label="Audio controls"
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" loop>
        <source src={src === '' ? undefined : src} type="audio/mpeg" />
      </audio>

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
        <AudioControlsProgress />
      </span>
    </nav>
  );
};

export default AudioControls;
