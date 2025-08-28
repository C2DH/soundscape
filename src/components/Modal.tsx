import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-1 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        className="relative bg-transparent rounded-2xl shadow-lg m-[5%] w-screen h-[90%] flex flex-col"
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 z-60"
          onClick={onClose}
          aria-label="Close modal"
        >
          X
        </button>

        {/* Content slot (for future canvases) */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
