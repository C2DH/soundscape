import { Html } from '@react-three/drei';
import { useSprings, animated } from '@react-spring/web';
import React from 'react';
import { useModalStore } from '../store';

const EarthRipple: React.FC<{ count?: number; size?: number; duration?: number }> = ({
  count = 5,
  size = 1300,
  duration = 5000,
}) => {
  const isOpen = useModalStore((s) => s.isOpenModal);
  const shouldAnimate = isOpen;

  // Create N springs for continuous ripples
  const springs = useSprings(
    count,
    Array.from({ length: count }).map((_, i) => ({
      from: { scale: 0.74, opacity: 0.15 },
      to: { scale: 1, opacity: 0 },
      loop: true,
      delay: duration / i,
      config: { duration },
      pause: shouldAnimate, // ✅ pause when not allowed
    }))
  );

  return (
    <Html transform sprite zIndexRange={[0, 1]}>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {springs.map((props, i) => (
          <animated.div
            key={i}
            className="absolute w-full h-full rounded-full border-[26px] border-[rgba(var(--light),0.7)]"
            style={{
              ...props,
              transform: props.scale.to((s) => `scale(${s})`),
            }}
          />
        ))}
      </div>
    </Html>
  );
};

export default EarthRipple;
