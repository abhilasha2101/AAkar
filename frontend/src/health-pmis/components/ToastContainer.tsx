import React, { useEffect } from "react";
import { useUiStore } from "../store/uiStore";

const TONE_CLASS: Record<string, string> = {
  success: "border-status-good text-status-good",
  error: "border-status-critical text-status-critical",
  warning: "border-status-attention text-status-attention",
  info: "border-navy text-navy",
};

function ToastItem({ id, type, message }: { id: string; type: string; message: string }) {
  const dismissToast = useUiStore((s) => s.dismissToast);
  useEffect(() => {
    const t = setTimeout(() => dismissToast(id), 4000);
    return () => clearTimeout(t);
  }, [id]);
  return (
    <div className={`bg-white shadow-lg rounded-md border-l-4 px-4 py-3 flex items-start gap-3 ${TONE_CLASS[type]}`}>
      <span className="text-sm font-medium text-slate-800 flex-1">{message}</span>
      <button onClick={() => dismissToast(id)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100] w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}
