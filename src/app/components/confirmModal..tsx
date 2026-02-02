"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({ isOpen, onConfirm, onClose }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <dialog
        open
        aria-modal="true"
        aria-labelledby="logout-title"
        className="rounded-lg p-6 bg-white"
      >
        <h2 id="logout-title" className="text-xl font-bold">
          Confirm Logout
        </h2>
        <p className="mt-2">You will be signed out of your account.</p>

        <div className="flex gap-4 mt-4">
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
}
