import { useEffect } from 'react';
import { useAudioStore, useThemeStore, localSoundScapeStore } from '../store';
import * as THREE from 'three';
import SoundLines from './SoundLines';
import SoundLine from './SoundLine';

const AudioVisualizer: React.FC<{ allLines: THREE.Vector3[][] }> = ({ allLines }) => {
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const setCurrentTime = useAudioStore((s) => s.setCurrentTime);

  const colors = useThemeStore((s) => s.colors);
  const totalLines = allLines.length;
  const visibleLines = Math.floor((currentTime / duration) * totalLines);

  const midpoint = Math.floor(totalLines / 2);

  // Adjust only the current index (visibleLines) if it's past midpoint by adding +1 to its z.
  const translatedLines = allLines.map((points, index) => {
    const baseZ = index - totalLines / 2;
    const z = index > midpoint && index === visibleLines ? baseZ - 1 : baseZ;
    return points.map((p) => new THREE.Vector3(p.x - points.length / 2, p.y, z));
  });

  useEffect(() => {
    let prevClickCounter = localSoundScapeStore.getState().clickCounter;
    const unsubscribe = localSoundScapeStore.subscribe((s) => {
      if (s.clickCounter > prevClickCounter) {
        const { lineTime } = s;
        setCurrentTime(lineTime);
      }
      prevClickCounter = s.clickCounter;
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <SoundLines
        lines={translatedLines}
        lineIdx={visibleLines}
        position={[0, 0.5, 0]}
        color={colors['--accent-3d']}
      />
      <SoundLine
        points={translatedLines[visibleLines] || []}
        scale={[1, 1, 1]}
        position={[0, 1, 0]}
        color={colors['--accent-3d-time']}
        currentTimeIndex={true}
      />
    </>
  );
};

export default AudioVisualizer;
