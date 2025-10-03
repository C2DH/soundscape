import Modal from './Modal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useModalStore, useStore, useSidebarStore } from '../store';
import AudioControls from './AudioControls';
import Scene from './Scene';
import landscapeData from '../../public/data/sweden.json';
import { AvailableAudioItems } from '../constants';
import { useItemDataPreloader } from '../hooks/useItemDataPreloader';

const SceneManager = () => {
  const navigate = useNavigate();
  const currentParamItemId = useStore((s) => s.currentParamItemId);
  const setCurrentParamItemId = useStore((s) => s.setCurrentParamItemId);
  const isOpen = useModalStore((s) => s.isOpenModal);
  const isOpenSidebar = useSidebarStore((s) => s.isOpenSidebar);
  const [showContent, setShowContent] = useState(false); // NEW

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
      // if user reloads and item exists in store/url → open modal again
      useModalStore.getState().openModal();
    } else {
      useModalStore.getState().closeModal();
    }
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      // reset first
      setShowContent(false);

      // delay rendering content
      const timer = setTimeout(() => setShowContent(true), 1000);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]); // include isOpen as dependency

  const renderModalContent = () => {
    if (!showContent) return null; // ⏱ wait 1s before rendering
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

    // Function to handle navigation to a specific item by id
    const goToItem = (itemId: string) => {
      const target = AvailableAudioItems.find((i) => i.id === itemId);
      if (!target) return;
      // update store so components depending on the id update immediately
      setCurrentParamItemId(target.id);
      // change the URL so LocationManager and router-aware components update
      navigate(target.url);
      // ensure modal is visible
      useModalStore.getState().openModal();
    };

    const handleNextCountry = () => {
      if (AvailableAudioItems.length === 0) return;
      const idx = AvailableAudioItems.findIndex((i) => i.id === currentParamItemId);
      const nextIndex = idx === -1 ? 0 : (idx + 1) % AvailableAudioItems.length;
      const nextItem = AvailableAudioItems[nextIndex];
      if (nextItem) goToItem(nextItem.id);
    };

    const handlePrevCountry = () => {
      if (AvailableAudioItems.length === 0) return;
      const idx = AvailableAudioItems.findIndex((i) => i.id === currentParamItemId);
      const prevIndex =
        idx === -1
          ? AvailableAudioItems.length - 1
          : (idx - 1 + AvailableAudioItems.length) % AvailableAudioItems.length;
      const prevItem = AvailableAudioItems[prevIndex];
      if (prevItem) goToItem(prevItem.id);
    };

    return (
      <div className={`${isOpenSidebar ? 'modal-open' : ''} SceneManager h-full w-full`}>
        <p className="big-text font-medium tracking-[-0.06em] uppercase absolute top-[10%] left-0 w-full flex flex-col items-center text-[12vw] opacity-20">
          {item?.name}
        </p>

        <AudioControls
          //   onNextVis={() => {}}
          //   onPrevVis={() => {}}
          onNextCountry={handleNextCountry}
          onPrevCountry={handlePrevCountry}
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
