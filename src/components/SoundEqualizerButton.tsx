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

  const toggleAnimation = () => {
    if (isPlaying) {
      lottieRef.current?.pause();
    } else {
      lottieRef.current?.play();
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
      className="flex flex-col justify-center items-center cursor-pointer absolute bottom-10 right-10"
      style={{
        width: width,
        height: height,
        zIndex: 120,
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
