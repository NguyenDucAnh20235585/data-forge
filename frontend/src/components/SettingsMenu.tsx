import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function SettingsMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { t, i18n } = useTranslation();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("data-forge-theme") === "dark",
  );

  // Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem("data-forge-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Lock background scrolling while Settings is open
  useEffect(() => {
    if (!settingsOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;

    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;

      window.scrollTo(0, scrollY);
    };
  }, [settingsOpen]);

  return (
    <div className="shrink-0">
      <button
        type="button"
        aria-label="Open settings"
        aria-haspopup="dialog"
        onClick={() => {
          dialogRef.current?.showModal();
          setSettingsOpen(true);
        }}
        className="group flex h-12 w-12 items-center justify-center
  rounded-xl border border-transparent text-muted
  transition-colors duration-200
  hover:border-control-outline hover:bg-surface-soft hover:text-accent
  focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-accent"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-300 ease-out
    group-hover:rotate-45
    motion-reduce:transition-none
    motion-reduce:transform-none"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.73v.5a2 2 0 0 1-1 1.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.73v-.5a2 2 0 0 1 1-1.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setSettingsOpen(false)}
        aria-labelledby="settings-title"
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto overscroll-contain rounded-xl border border-outline bg-surface p-6 text-ink shadow-xl backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-semibold">
            {t("settings.title")}
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
            <label htmlFor="settings-language" className="text-sm font-medium">
              {t("settings.language")}
            </label>

            <select
              id="settings-language"
              value={i18n.resolvedLanguage ?? "en"}
              onChange={(event) => {
                const language = event.target.value;

                localStorage.setItem("data-forge-language", language);
                void i18n.changeLanguage(language);
              }}
              className="h-10 w-32 rounded-md border border-control-outline bg-surface px-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-5">
            <label htmlFor="settings-dark-mode" className="text-sm font-medium">
              {t("settings.darkMode")}
            </label>

            <label className="relative inline-flex h-[30px] w-[52px] cursor-pointer items-center">
              <input
                id="settings-dark-mode"
                type="checkbox"
                role="switch"
                checked={darkMode}
                onChange={(event) => setDarkMode(event.target.checked)}
                className="peer sr-only"
              />

              <span
                aria-hidden="true"
                className="h-[30px] w-[52px] rounded-full bg-zinc-400
      transition-colors duration-200
      peer-checked:bg-violet-600
      peer-focus-visible:outline-2
      peer-focus-visible:outline-offset-2
      peer-focus-visible:outline-accent"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[3px] top-[3px]
      h-6 w-6 rounded-full bg-white shadow-sm
      transition-transform duration-200
      peer-checked:translate-x-[22px]"
              />
            </label>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default SettingsMenu;
