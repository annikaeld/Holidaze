import { useEffect, useRef, type ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  isPending,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-dialog-title"
      onCancel={(event) => {
        if (isPending) {
          event.preventDefault();
          return;
        }

        onClose();
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-card-border bg-card p-6 text-card-foreground wrap-break-word shadow-xl backdrop:bg-black/50"
    >
      <h2 id="confirm-dialog-title" className="text-xl font-semibold">
        {title}
      </h2>

      <div className="mt-4 space-y-3 text-sm">{children}</div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          autoFocus
          disabled={isPending}
          onClick={onClose}
          className="w-full cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-field-active disabled:cursor-not-allowed sm:w-auto"
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={onConfirm}
          className="w-full cursor-pointer rounded-full border border-toast-error-border bg-toast-error px-4 py-2 text-sm font-medium text-toast-error-foreground hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isPending ? "Processing..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
