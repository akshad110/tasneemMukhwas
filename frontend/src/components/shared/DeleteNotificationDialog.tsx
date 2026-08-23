const INK = '#0a2e22'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

type DeleteNotificationDialogProps = {
  open: boolean
  title?: string
  message: string
  deleting?: boolean
  onCancel: () => void
  onConfirm: () => void
}

/** Cancel / Delete confirmation for notification removal. */
export default function DeleteNotificationDialog({
  open,
  title = 'Delete notification?',
  message,
  deleting = false,
  onCancel,
  onConfirm,
}: DeleteNotificationDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="delete-notification-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-5 sm:p-6"
        style={{ backgroundColor: CARD, borderColor: LINE }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-notification-title" className="m-0 text-[1.15rem] font-bold" style={{ color: INK }}>
          {title}
        </h2>
        <p className="mt-2 m-0 text-[0.9rem] leading-relaxed" style={{ color: MUTED }}>
          {message}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className="cursor-pointer rounded-xl border px-4 py-2.5 text-[0.85rem] font-semibold transition hover:bg-black/[0.03] disabled:opacity-60"
            style={{ borderColor: LINE, backgroundColor: CARD, color: INK }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.85rem] font-semibold disabled:opacity-60"
            style={{ backgroundColor: '#a32020', color: '#fff' }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
