import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl sm:max-w-lg relative max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
        >
          &times;
        </button>

        {/* Contenido del modal */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;