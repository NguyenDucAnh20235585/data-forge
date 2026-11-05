import { useRef } from "react";

function SettingsMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="absolute right-0 top-0">
      <button
        type="button"
        aria-label="Open settings"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-md p-2 text-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2 2-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.06 1.56V20h-2.8v-.1a1.7 1.7 0 0 0-1.06-1.56 1.7 1.7 0 0 0-1.88.34L9 18.74l-2-2 .06-.06A1.7 1.7 0 0 0 7.4 14.8a1.7 1.7 0 0 0-1.56-1.06H5.7v-2.8h.14A1.7 1.7 0 0 0 7.4 9.88a1.7 1.7 0 0 0-.34-1.88L7 7.94l2-2 .06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12 4.78V4.7h2.8v.08a1.7 1.7 0 0 0 1.06 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2 2-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.06h.14v2.8h-.14A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="settings-title"
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-outline bg-surface p-6 text-ink shadow-xl backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-semibold">
            Settings
          </h2>

          <button
            type="button"
            aria-label="Close settings"
            onClick={() => dialogRef.current?.close()}
            className="rounded-md p-2 text-muted hover:bg-surface-soft hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 divide-y divide-outline border-t border-outline">
          <div className="flex items-center justify-between py-5">
            <span className="text-sm font-medium">Language</span>
            <span className="text-sm text-muted">English</span>
          </div>

          <div className="flex items-center justify-between py-5">
            <span className="text-sm font-medium">Dark Mode</span>
            <span className="text-sm text-muted">Off</span>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default SettingsMenu;
