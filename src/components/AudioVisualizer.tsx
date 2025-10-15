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

  /**
   * Index adjusted for centered visualization (orbit controller centers the view).
   * Offset by 1 when past midpoint to maintain visual alignment.
   */
  const currentTimeLineIndex =
    progressBasedLineCount >= totalLinesCount / 2
      ? progressBasedLineCount - 1
      : progressBasedLineCount;

  console.log('AudioVisualizer render:', {
    currentTime,
    duration,
  });

  return (
    <>
      <SoundLines
        lines={soundLinesVectors}
        lineIdx={progressBasedLineCount}
        position={[0, 0.5, 0]}
        color={colors['--accent-3d']}
      />
      <SoundLine
        points={soundLinesVectors[currentTimeLineIndex] || []}
        scale={[1, 1, 1]}
        position={[0, 1, 0]}
        color={colors['--accent-3d-time']}
        showCurrentTimeAsHtml={true}
      />
    </>
  );
};

export default AudioVisualizer;
