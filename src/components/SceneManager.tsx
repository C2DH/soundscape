import Modal from './Modal';
import { useEffect } from 'react';
import { useThemeStore, useModalStore } from '../store';
import AudioControls from './AudioControls';
import Scene from './Scene';
import landscapeData from '../../src/assets/data/vis/sweden.json';

const SceneManager = () => {
  const { isOpenModal, closeModal } = useModalStore();
  const refreshFromCSS = useThemeStore((s) => s.refreshFromCSS);

  useEffect(() => {
    refreshFromCSS();
  }, [refreshFromCSS]);

  return (
    <div className="Scene absolute h-full w-full">
      <Modal isOpen={isOpenModal} onClose={closeModal}>
        {isOpenModal ? (
          <AudioControls
            onNextVis={() => {}}
            onPrevVis={() => {}}
            onNextCountry={() => {}}
            onPrevCountry={() => {}}
            src="/audio/Sweden.mp3"
          />
        ) : null}
        <Scene landscapeData={landscapeData} />
      </Modal>
    </div>
  );
};

export default SceneManager;
