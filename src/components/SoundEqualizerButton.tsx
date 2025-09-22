import React, { useRef, useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import animationData from '../assets/data/SoundEqualizerButton.json';

interface SoundEqualizerButtonProps {
  width?: number;
  color?: string; // new prop to control color
}

const SoundEqualizerButton: React.FC<SoundEqualizerButtonProps> = ({
  width = 32,
  color = 'rgba(var(--light), 1)', // default color black
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const ratio = 115 / 80;
  const height = width / ratio;

  // store previous volumes per audio element so we can restore them
  const prevVolumesRef = useRef<Map<HTMLAudioElement, number>>(new Map());

  const toggleAnimation = () => {
    // toggle Lottie visual state
    if (isPlaying) {
      lottieRef.current?.pause();
    } else {
      lottieRef.current?.play();
    }

    // find all audio elements on the page
    const audios = Array.from(document.querySelectorAll('audio')) as HTMLAudioElement[];

    if (isPlaying) {
      // muting: save current volume then set to 0
      audios.forEach((a) => {
        try {
          prevVolumesRef.current.set(a, a.volume);
          a.volume = 0;
        } catch {
          /* ignore */
        }
      });
    } else {
      // unmuting: restore previous volumes (fallback to 1)
      audios.forEach((a) => {
        try {
          const prev = prevVolumesRef.current.get(a);
          a.volume = typeof prev === 'number' ? prev : 1;
        } catch {
          /* ignore */
        }
      });
      // clear saved volumes (optional)
      prevVolumesRef.current.clear();
    }

    setIsPlaying(!isPlaying);
  };

  // Effect to recolor the animation whenever "color" changes
  useEffect(() => {
    const svgElements = lottieRef.current?.animationContainerRef.current?.querySelectorAll(
      'path, circle, rect, polygon'
    );
    svgElements?.forEach((el) => {
      (el as SVGElement).setAttribute('fill', color);
      (el as SVGElement).setAttribute('stroke', color);
    });
  }, [color]);

  return (
    <div
      onClick={toggleAnimation}
      className="SoundEqualizerButton flex flex-col justify-center items-center cursor-pointer absolute bottom-13 sm:bottom-10  right-6 sm:right-8 z-51"
      style={{
        width: width,
        height: height,
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
      <span className="flex uppercase text-[0.6em] font-bold whitespace-nowrap">
        Sound {isPlaying ? 'On' : 'Off'}
      </span>
    </div>
  );
};

export default SoundEqualizerButton;
