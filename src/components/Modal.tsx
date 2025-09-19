import CloseIcon from './svg/CloseIcon';
import { useModalStore } from '../store';
import './Modal.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const isOpen = useModalStore((s) => s.isOpenModal);
  const onClose = useModalStore((s) => s.closeModal);
  const navigate = useNavigate();
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
        <div className="z-50 flex flex-col items-center justify-center backdrop-blur-sm w-full h-screen">
          {/* Toggle Button */}
          <div className="bg-transparent w-full h-full shadow-lg flex flex-col">
            <button
              className="CloseIconButton absolute top-5 right-5 p-2 z-60"
              onClick={() => {
                onClose();
                navigate('/overview');
              }}
              aria-label="Close modal"
            >
              <CloseIcon width={32} />
              <div className="cross-group">
                <span className="bar"></span>
                <span className="bar"></span>
              </div>
            </button>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
