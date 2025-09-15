import Modal from './Modal';
import { useEffect } from 'react';
import { useThemeStore, useModalStore, useStore } from '../store';
import AudioControls from './AudioControls';
import Scene from './Scene';
import landscapeData from '../../src/assets/data/vis/poland.json';
import { AvailableAudioItems } from '../constants';

const SceneManager = () => {
  const { isOpenModal, closeModal } = useModalStore();
  const refreshFromCSS = useThemeStore((s) => s.refreshFromCSS);

  const currentParamItemId = useStore((s) => s.currentParamItemId);
  const item = AvailableAudioItems.find((i) => i.id === currentParamItemId);

  useEffect(() => {
    refreshFromCSS();
  }, [refreshFromCSS]);

  return (
    <div className="Scene absolute h-full w-full">
      <Modal isOpen={!!item} onClose={closeModal}>
        {item ? (
          <AudioControls
            onNextVis={() => {}}
            onPrevVis={() => {}}
            onNextCountry={() => {}}
            onPrevCountry={() => {}}
            src={item?.audioSrc}
          />
        ) : null}
        <Scene landscapeData={landscapeData} />
      </Modal>
    </div>
  );
};

export default SceneManager;
