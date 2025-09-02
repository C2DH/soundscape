import React, { useEffect } from 'react';
import { useSidebarStore } from '../store';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const { isOpenSidebar, toggleSidebar } = useSidebarStore();
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
      {isOpen ? (
        <button
          onClick={toggleSidebar}
          aria-expanded={isOpenSidebar}
          className="more-info absolute top-6 left-4 z-90 p-2 rounded bg-indigo-600 text-white shadow-lg"
        >
          <i className="relative">
            <span className="bar"></span>
            <span className={`bar ${isOpenSidebar ? 'open' : ''}`}></span>
          </i>
          <p>MORE INFO</p>
        </button>
      ) : null}
      <div
        className={` ${isOpen ? 'isOpenModal' : ''} z-50 Modal flex absolute top-0 left-0 items-center justify-center w-full h-screen`}
      >
        <div className="z-50 flex flex-col items-center justify-center backdrop-blur-sm w-full h-screen">
          {/* Toggle Button */}
          <div className="bg-transparent w-full h-full shadow-lg flex flex-col">
            <button
              className="absolute top-3 right-3 p-2 z-60"
              onClick={() => {
                onClose();
                isOpenSidebar ? toggleSidebar() : null;
              }}
              aria-label="Close modal"
            >
              X
            </button>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
