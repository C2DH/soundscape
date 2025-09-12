import { useEffect } from 'react';
import { useAudioStore, useThemeStore, localSoundScapeStore } from '../store';
import * as THREE from 'three';
import SoundLines from './SoundLines';
import SoundLine from './SoundLine';
import { isMobile } from 'react-device-detect';

const AudioVisualizer: React.FC<{ allLines: THREE.Vector3[][] }> = ({ allLines }) => {
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  // const setCurrentTime = useAudioStore((s) => s.setCurrentTime);
  const { setCurrentTime } = useAudioStore();
  // console.log('currentTime', currentTime);

  useEffect(() => {
    let prevClickCounter = localSoundScapeStore.getState().clickCounter;
    const unsubscribe = localSoundScapeStore.subscribe((s) => {
      const { lineTime } = s;
      console.log('HERE');
      if (s.clickCounter > prevClickCounter) {
        console.log('linetime', lineTime);
        setCurrentTime(lineTime);
        // Any additional actions after setting the time can be placed here
      }
      prevClickCounter = s.clickCounter;
      if (isMobile) {
        setCurrentTime(lineTime);
      }
    });

    return () => unsubscribe();
  }, [setCurrentTime]);

  const totalLines = allLines.length;
  const visibleLines = Math.floor((currentTime / duration) * totalLines);

  const translatedLines = allLines.map((points, index) =>
    points.map((p) => new THREE.Vector3(p.x - points.length / 2, p.y, index - totalLines / 2))
  );

  return (
    <>
      <SoundLines
        lines={translatedLines}
        lineIdx={visibleLines}
        position={[0, 0.5, 0]}
        color={useThemeStore((s) => s.colors['--accent-3d'])}
      />
      <SoundLine
        points={translatedLines[visibleLines] || []}
        scale={[1, 1, 1]}
        position={[0, 1, 0]}
        color={useThemeStore((s) => s.colors['--accent-3d-time'])}
        currentTimeIndex={true}
      />
    </>
  );
};

export default AudioVisualizer;
