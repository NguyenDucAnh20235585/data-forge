import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function SettingsMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("data-forge-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem("data-forge-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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
