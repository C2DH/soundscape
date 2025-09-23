import CloseIcon from './svg/CloseIcon';
import { useModalStore, useSidebarStore } from '../store';
import './Modal.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ListNavigation from './ListNavigation';

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const isOpenSidebar = useSidebarStore((s) => s.isOpenSidebar);
  const isOpen = useModalStore((s) => s.isOpenModal);
  const onClose = useModalStore((s) => s.closeModal);
  const navigate = useNavigate();
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div
        className={` ${isOpen ? 'isOpenModal' : ''} z-50 Modal flex absolute top-0 left-0 items-center justify-center w-full h-screen`}
      >
        <button
          className={`${isOpenSidebar ? 'isOpenSidebar' : ''} CloseIconButton absolute right-[-0.9rem] sm:right-0 top-5  p-2 z-60`}
          onClick={() => {
            isOpenSidebar ? toggleSidebar() : null;
            onClose();
            navigate('/overview');
          }}
          aria-label="Close modal"
        >
          <CloseIcon width={28} />
          <div className="cross-group">
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </button>
        <div className="z-50 flex flex-col items-center justify-center backdrop-blur-sm w-full h-screen">
          {/* Toggle Button */}
          <div className="bg-transparent w-full h-full shadow-lg flex flex-col">
            <ListNavigation />

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
