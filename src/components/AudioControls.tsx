import type { FC } from 'react';
import { useState } from 'react';
import PlaySign from './svg/PlaySign';
import './AudioControls.css';
import PauseSign from './svg/PauseSign';
import NextVisSign from './svg/NextVisSign';
import NextCountrySign from './svg/NextCountrySign';

type AudioControlsProps = {
  // onPlay: () => void;
  // onPause: () => void;
  onNextVis: () => void;
  onPrevVis: () => void;
  onNextCountry: () => void;
  onPrevCountry: () => void;
};

const AudioControls: FC<AudioControlsProps> = ({
  // onPlay,
  // onPause,
  onNextVis,
  onPrevVis,
  onNextCountry,
  onPrevCountry,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const handleToggle = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <nav
      className="AudioControls absolute bottom-[10%] left-[calc(50%-100px)] flex flex-col items-center justify-center gap-1"
      aria-label="Audio controls"
    >
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
            <PlaySign />
          </button>
        ) : (
          <button className="no-opacity" onClick={handleToggle} aria-label="Play">
            <PauseSign />
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
      <span className="duration">40:00 / 15:45</span>
    </nav>
  );
};

export default AudioControls;
