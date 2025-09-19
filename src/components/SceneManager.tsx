import Modal from './Modal';
import { useEffect } from 'react';
import { useModalStore, useStore, useSidebarStore } from '../store';
import AudioControls from './AudioControls';
import Scene from './Scene';
import landscapeData from '../../public/data/sweden.json';
import { AvailableAudioItems } from '../constants';
import { useItemDataPreloader } from '../hooks/useItemDataPreloader';

const SceneManager = () => {
  const currentParamItemId = useStore((s) => s.currentParamItemId);
  const isOpen = useModalStore((s) => s.isOpenModal);
  const isOpenSidebar = useSidebarStore((s) => s.isOpenSidebar);

  let item: (typeof AvailableAudioItems)[number] | undefined;
  let itemIndex = -1;
  for (let i = 0; i < AvailableAudioItems.length; i++) {
    if (AvailableAudioItems[i].id === currentParamItemId) {
      item = AvailableAudioItems[i];
      itemIndex = i;
      break;
    }
  }
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
        <div className="w-full h-full flex items-center justify-center">{/* error content */}</div>
      );
    }

    const audioSrc = item?.audioSrc;

    // ✅ Only render Scene (Canvas) if itemData exists and modal is open
    if (!itemData || !isOpen) {
      return null; // avoid rendering Canvas too early
    }

    return (
      <div className={`${isOpenSidebar ? 'modal-open' : ''} SceneManager h-full w-full`}>
        <p className="big-text font-medium tracking-[-0.06em] uppercase absolute top-[10%] left-0 w-full flex flex-col items-center text-[12vw] opacity-20">
          {item?.name}
        </p>

        <AudioControls
          onNextVis={() => {}}
          onPrevVis={() => {}}
          onNextCountry={() => {}}
          onPrevCountry={() => {}}
          src={audioSrc}
          playlistIdx={itemIndex}
          playListLength={AvailableAudioItems.length}
        />

        <Scene landscapeData={itemData || landscapeData} />
      </div>
    );
  };

  return (
    <div className="Scene absolute h-full w-full">
      <Modal>
        <div className="w-full h-full">{renderModalContent()}</div>
      </Modal>
    </div>
  );
};

export default SceneManager;
