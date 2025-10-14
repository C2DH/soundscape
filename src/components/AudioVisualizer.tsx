import { useAudioStore, useThemeStore, localSoundScapeStore } from '../store';
import * as THREE from 'three';
import SoundLines from './SoundLines';
import SoundLine from './SoundLine';
import { useEffect } from 'react';

const AudioVisualizer: React.FC<{ allLines: THREE.Vector3[][] }> = ({ allLines }) => {
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const lineTime = localSoundScapeStore((s) => s.lineTime);
  const setCurrentTime = useAudioStore((s) => s.setCurrentTime);

  const colors = useThemeStore((s) => s.colors);
  const totalLines = allLines.length;

  useEffect(() => {
    setCurrentTime(lineTime);
  }, [lineTime]);

  const visibleLines = Math.floor((currentTime / duration) * totalLines);

  const midpoint = Math.floor(totalLines / 2);

  // Adjust visibleLines if it's past midpoint
  const adjustedVisibleLines = visibleLines >= midpoint ? visibleLines - 1 : visibleLines;

  // Adjust only the current index (visibleLines) if it's past midpoint by adding -midpoint to z
  const translatedLines = allLines.map((points) =>
    points.map((p) => new THREE.Vector3(p.x - points.length / 2, p.y, p.z - midpoint))
  );

  return (
    <>
      <SoundLines
        lines={translatedLines}
        lineIdx={visibleLines}
        position={[0, 0.5, 0]}
        color={colors['--accent-3d']}
      />
      <SoundLine
        points={translatedLines[adjustedVisibleLines] || []}
        scale={[1, 1, 1]}
        position={[0, 1, 0]}
        color={colors['--accent-3d-time']}
        currentTimeIndex={true}
      />
    </>
  );
};

export default AudioVisualizer;
