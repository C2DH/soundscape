import { useAudioStore, useThemeStore } from '../store';
import * as THREE from 'three';
import SoundLines from './SoundLines';
import SoundLine from './SoundLine';

export interface AudioVisualizerProps {
  /** Array of 3D vector arrays representing sound wave lines */
  soundLinesVectors: THREE.Vector3[][];
}

/**
 * AudioVisualizer component that renders animated sound wave visualization.
 * Displays progressive sound lines based on current playback time and highlights
 * the current time position with a distinct line.
 */
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ soundLinesVectors }) => {
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const colors = useThemeStore((s) => s.colors);

  const totalLinesCount = soundLinesVectors.length;

  /** Number of lines to display based on playback progress */
  const progressBasedLineCount = Math.floor((currentTime / duration) * totalLinesCount);

  return (
    <>
      <SoundLines
        lines={soundLinesVectors}
        lineIdx={progressBasedLineCount}
        position={[0, 0.5, 0]}
        color={colors['--accent-3d']}
      />
      <SoundLine
        points={soundLinesVectors[progressBasedLineCount] || []}
        scale={[1, 1, 1]}
        position={[0, 1, 0]}
        color={colors['--accent-3d-time']}
        showCurrentTimeAsHtml={true}
      />
    </>
  );
};

export default AudioVisualizer;
