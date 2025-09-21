import type { FC } from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import PlaySign from './svg/PlaySign';
import './AudioControls.css';
import PauseSign from './svg/PauseSign';
// import NextVisSign from './svg/NextVisSign';
import NextCountrySign from './svg/NextCountrySign';
import { useAudioStore, localSoundScapeStore } from '../store';
// import { formatTime } from '../audio';
import AudioControlsProgress from './AudioControlsProgress';
import { AvailableAudioItems } from '../constants'; // added
import PrevNextLabel from './PrevNextLabel';

type AudioControlsProps = {
  // onNextVis: () => void;
  // onPrevVis: () => void;
  onNextCountry: () => void;
  onPrevCountry: () => void;
  onTimeUpdate?: (time: number) => void; // NEW
  onDuration?: (duration: number) => void; // NEW
  src?: string; // NEW
  playlistIdx?: number; // NEW -1 means no playlist
  playListLength?: number; // NEW total items in playlist
};

const AudioControls: FC<AudioControlsProps> = ({
  // onNextVis,
  // onPrevVis,
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

  // Hover state for tooltips
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  // derive prev/next names from playlistIdx & playListLength
  const prevName = useMemo(() => {
    if (playListLength <= 0 || AvailableAudioItems.length === 0) return '';
    const idx = playlistIdx >= 0 && playlistIdx < playListLength ? playlistIdx : -1;
    const prevIndex = idx === -1 ? playListLength - 1 : (idx - 1 + playListLength) % playListLength;
    return AvailableAudioItems[prevIndex]?.name ?? '';
  }, [playlistIdx, playListLength]);

  const nextName = useMemo(() => {
    if (playListLength <= 0 || AvailableAudioItems.length === 0) return '';
    const idx = playlistIdx >= 0 && playlistIdx < playListLength ? playlistIdx : -1;
    const nextIndex = idx === -1 ? 0 : (idx + 1) % playListLength;
    return AvailableAudioItems[nextIndex]?.name ?? '';
  }, [playlistIdx, playListLength]);

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
    <div className="nav-wrapper absolute bottom-[10%] w-screen flex flex-col items-center justify-center gap-1 z-50">
      <nav
        className="AudioControls flex flex-col items-center justify-center"
        aria-label="Audio controls"
      >
        {/* Hidden audio element */}
        <audio ref={audioRef} preload="auto" loop>
          <source src={src === '' ? undefined : src} type="audio/mpeg" />
        </audio>

        <div
          className="button-group flex items-center justify-center gap-6"
          style={{ position: 'relative' }}
        >
          <PrevNextLabel
            hoverPrev={hoverPrev}
            hoverNext={hoverNext}
            prevName={prevName}
            nextName={nextName}
          />
          {/* Previous catalogue (wrapped for hover state) */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={onPrevCountry}
              aria-label="Previous catalogue"
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
            >
              <NextCountrySign className="transform rotate-180 mr-2" />
            </button>
          </div>

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

          {/* Next catalogue (wrapped for hover state) */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={onNextCountry}
              aria-label="Next catalogue"
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
            >
              <NextCountrySign />
            </button>
          </div>
        </div>

        {/* Optional: duration/time display */}
        <span className="duration">
          <AudioControlsProgress />
        </span>
      </nav>
    </div>
  );
};

export default AudioControls;
