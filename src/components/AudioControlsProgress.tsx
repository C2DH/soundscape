import { formatTime } from '../audio';
import { useAudioStore } from '../store';

const AudioControlsProgress = () => {
  const { currentTime, duration } = useAudioStore();
  return (
    <>
      {formatTime(currentTime)} / {formatTime(duration)}
    </>
  );
};

export default AudioControlsProgress;
