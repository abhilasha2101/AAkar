import React from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
}

export function Modal({ title, onClose, children, widthClass = "max-w-lg" }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-md shadow-xl w-full ${widthClass} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold text-navy">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
