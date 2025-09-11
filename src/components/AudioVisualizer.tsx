import ProgressiveLines from './ProgressiveLines';
import * as THREE from 'three';
import { useAudioStore } from '../store';
import CurrentTimeLine from './CurrentTimeLine';

// Example parent component
const AudioVisualizer: React.FC<{ allLines: THREE.Vector3[][] }> = ({ allLines }) => {
  const { currentTime, duration } = useAudioStore();

  const totalLines = allLines.length; // should be 100
  const visibleLines = Math.floor((currentTime / duration) * totalLines);

  return (
    <>
      {/* The 3D scene */}
      <ProgressiveLines allLines={allLines} visibleLines={visibleLines} />
      <CurrentTimeLine allLines={allLines} visibleLines={visibleLines} />
    </>
  );
};

export default AudioVisualizer;
