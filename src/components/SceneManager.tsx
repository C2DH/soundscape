import Modal from './Modal';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useModalStore, useStore } from '../store';
import AudioControls from './AudioControls';
import Scene from './Scene';
import landscapeData from '../../public/data/sweden.json';
import { AvailableAudioItems } from '../constants';
import { useItemDataPreloader } from '../hooks/useItemDataPreloader';

const SceneManager = () => {
  const navigate = useNavigate();
  const closeModal = useModalStore((state) => state.closeModal);
  const isOpenModal = useModalStore((state) => state.isOpenModal);

  const currentParamItemId = useStore((s) => s.currentParamItemId);
  const setCurrentParamItemId = useStore((s) => s.setCurrentParamItemId);
  const item = AvailableAudioItems.find((i) => i.id === currentParamItemId);

  // Preload item data
  const {
    data: itemData,
    loading: itemDataLoading,
    error: itemDataError,
  } = useItemDataPreloader(item ? item.json : null);

  useEffect(() => {
    if (item) {
      // Open modal when item is set
      // Slight delay to ensure modal opens after any route changes
      setTimeout(() => {
        useModalStore.getState().openModal();
      }, 100);
    } else {
      // Close modal if no item
      useModalStore.getState().closeModal();
    }
  }, [item]);

  const handleCloseModal = () => {
    closeModal();
    setCurrentParamItemId(null);
    navigate('/');
  };

  const renderModalContent = () => {
    if (itemDataLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            <p className="text-lg opacity-70">Loading {item?.name}...</p>
          </div>
        </div>
      );
    }

    if (itemDataError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-red-500 text-6xl">⚠️</div>
            <p className="text-lg font-medium">Failed to load data</p>
            <p className="text-sm opacity-70 max-w-md">{itemDataError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent text-dark rounded hover:opacity-80 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    const audioSrc = item?.audioSrc;
    console.info('Rendering SceneManager with item:', item?.name, 'audioSrc:', audioSrc);
    return (
      <>
        <p className="big-text font-medium tracking-[-0.06em] uppercase absolute top-[10%] left-0 w-full flex flex-col items-center text-[12vw] opacity-20">
          {item?.name}
        </p>

        <AudioControls
          onNextVis={() => {}} // Navigation handled internally
          onPrevVis={() => {}} // Navigation handled internally
          onNextCountry={() => {}}
          onPrevCountry={() => {}}
          src={audioSrc}
        />

        <Scene landscapeData={itemData || landscapeData} />
      </>
    );
  };

  return (
    <div className="Scene absolute h-full w-full">
      <Modal isOpen={isOpenModal} onClose={handleCloseModal}>
        <div className="w-full h-full">{renderModalContent()}</div>
      </Modal>
    </div>
  );
};

export default SceneManager;
