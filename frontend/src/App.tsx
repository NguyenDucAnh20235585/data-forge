import { useState } from "react";

import { generateData } from "./api/generatorApi";
import { validateFields } from "./utils/validateFields";
import SettingsMenu from "./components/SettingsMenu";
import { useTranslation } from "react-i18next";
import "./i18n";

import type { Preset, CustomField, GeneratedRecord } from "./types/generator";

import PreviewTable from "./components/PreviewTable";
import CustomFieldEditor from "./components/CustomFieldEditor";
import { exportJson, exportCsv } from "./utils/exportData";
import type { FieldValidationError } from "./utils/validateFields";

function App() {
  const { t, i18n } = useTranslation();
  const locale =
    i18n.resolvedLanguage === "vi" || i18n.resolvedLanguage === "ja"
      ? i18n.resolvedLanguage
      : "en";
  const [preset, setPreset] = useState<Preset>("users");
  const [count, setCount] = useState(3);
  const [records, setRecords] = useState<GeneratedRecord[]>([]);
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"quick" | "custom">("quick");

  const [fields, setFields] = useState<CustomField[]>([
    { name: "playerName", type: "personName" },
  ]);

  const [fieldError, setFieldError] = useState<FieldValidationError | null>(
    null,
  );

  const updateFields: typeof setFields = (update) => {
    setFields(update);
    setFieldError(null);
    setError("");
  };

  const currentConfig = JSON.stringify(
    mode === "quick"
      ? { mode, count, preset, locale }
      : { mode, count, fields, locale },
  );

  const handleAddField = () => {
    updateFields((previous) => {
      let next = 2;

      while (
        previous.some(
          (field) => field.name.trim().toLowerCase() === `field${next}`,
        )
      ) {
        next++;
      }

      return [...previous, { name: `field${next}`, type: "number" }];
    });
  };

  const isPreviewStale =
    records.length > 0 &&
    generatedConfig !== null &&
    generatedConfig !== currentConfig;

  const handleExportJson = () => {
    exportJson(records);
  };

  const handleExportCsv = () => {
    exportCsv(records);
  };

  const handleGenerate = async () => {
    if (mode === "custom") {
      const validationError = validateFields(fields);

      if (validationError) {
        setFieldError(validationError);
        return;
      }
    }

    setFieldError(null);
    setLoading(true);
    setError("");

    const minimumLoading = new Promise<void>((resolve) => {
      setTimeout(resolve, 600);
    });

    try {
      const payload =
        mode === "quick"
          ? { count, preset }
          : {
              count,
              fields: fields.map((field) =>
                field.type === "choice"
                  ? {
                      ...field,
                      options: field.options?.map((option) => option.trim()),
                    }
                  : field,
              ),
            };

      const data = await generateData(mode, payload, locale);
      setRecords(data);
      setGeneratedConfig(currentConfig);
    } catch (error) {
      console.error(error);
      setError("errors.generateFailed");
    } finally {
      await minimumLoading;
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-outline bg-canvas">
        <div className="relative mx-auto flex h-[72px] w-full max-w-5xl items-center justify-between gap-4 px-4 sm:h-[88px] sm:px-6 lg:h-[136px]">
          <div className="min-w-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-5xl">
              Data Forge
            </h1>

            <p className="mt-3 hidden text-base text-muted lg:block">
              {t("appDescription")}
            </p>
          </div>

          <div className="ml-auto shrink-0">
            <SettingsMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 rounded-xl border border-outline bg-surface p-6 shadow-[0_6px_24px_rgba(26,26,26,0.07)]">
          <div>
            <h2 className="text-xl font-semibold text-ink">
              {t("configureDataset")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {t("configuration.description")}
            </p>
          </div>
          <div
            className="flex w-fit gap-1 rounded-lg bg-surface-soft p-1"
            role="group"
            aria-label={t("configuration.generationMode")}
          >
            <button
              type="button"
              aria-pressed={mode === "quick"}
              onClick={() => {
                setMode("quick");
                setError("");
                setFieldError(null);
              }}
              className={`mode-tab rounded-md px-4 py-2 text-sm font-medium ${
                mode === "quick"
                  ? "bg-surface text-ink shadow-sm"
                  : "bg-transparent text-muted hover:text-ink"
              }`}
            >
              {t("configuration.quickPreset")}
            </button>

            <button
              type="button"
              aria-pressed={mode === "custom"}
              onClick={() => {
                setMode("custom");
                setError("");
                setFieldError(null);
              }}
              className={`mode-tab rounded-md px-4 py-2 text-sm font-medium ${
                mode === "custom"
                  ? "bg-surface text-ink shadow-sm"
                  : "bg-transparent text-muted hover:text-ink"
              }`}
            >
              {t("configuration.customFields")}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {mode === "quick" && (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="preset"
                  className="text-sm font-medium text-ink"
                >
                  {t("configuration.preset")}
                </label>

                <select
                  id="preset"
                  value={preset}
                  onChange={(event) => setPreset(event.target.value as Preset)}
                  className="w-56 rounded-md border border-control-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="users">
                    {t("configuration.presets.users")}
                  </option>
                  <option value="products">
                    {t("configuration.presets.products")}
                  </option>
                  <option value="employees">
                    {t("configuration.presets.employees")}
                  </option>
                  <option value="umamusume">
                    {t("configuration.presets.umamusume")}
                  </option>
                  <option value="orders">
                    {t("configuration.presets.orders")}
                  </option>
                  <option value="apiLogs">
                    {t("configuration.presets.apiLogs")}
                  </option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label htmlFor="count" className="text-sm font-medium text-ink">
                {t("configuration.numberOfRecords")}
              </label>

              <input
                id="count"
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="w-32 rounded-md border border-control-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {mode === "custom" && (
            <CustomFieldEditor
              fields={fields}
              setFields={updateFields}
              fieldError={fieldError}
            />
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {mode === "custom" && (
              <button
                type="button"
                onClick={handleAddField}
                className="rounded-md border border-control-outline bg-surface inline-flex h-11 items-center justify-center px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-soft w-full whitespace-nowrap sm:w-auto"
              >
                {t("configuration.addField")}
              </button>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              aria-busy={loading}
              disabled={
                loading || !Number.isInteger(count) || count < 1 || count > 1000
              }
              className="
  inline-flex h-12 w-full items-center justify-center rounded-md px-6
sm:ml-auto sm:w-44
  bg-action-primary text-sm font-semibold text-action-primary-ink
  transition-[transform,background-color,box-shadow]
  duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
  hover:bg-action-primary-hover 
  shadow-[0_4px_0_#8F7BC4]
  active:translate-y-[3px]
  active:shadow-[0_1px_0_#8F7BC4]
  active:duration-100
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
  disabled:cursor-not-allowed disabled:opacity-50
  disabled:active:scale-100
  disabled:aria-busy:opacity-100
"
            >
              {loading ? (
                <span
                  role="status"
                  className="animate-[pulse_1s_ease-in-out_infinite] motion-reduce:animate-none"
                >
                  {t("configuration.generating")}
                </span>
              ) : (
                t("configuration.generateData")
              )}
            </button>
          </div>
        </div>

        {error && !fieldError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {t(error)}
          </p>
        )}

        <section className="mt-8 rounded-xl border border-outline bg-surface p-6 shadow-[0_6px_24px_rgba(26,26,26,0.07)]">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">
                {t("preview.title")}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {t("preview.generatedRecords", { count: records.length })}
              </p>
            </div>

            {records.length > 0 && (
              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  onClick={handleExportJson}
                  className="rounded-md border border-control-outline bg-surface inline-flex h-11 items-center justify-center px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-soft flex-1 whitespace-nowrap sm:flex-none"
                >
                  {t("preview.exportJson")}
                </button>
                <button
                  onClick={handleExportCsv}
                  className="rounded-md border border-control-outline bg-surface inline-flex h-11 items-center justify-center px-4 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-soft flex-1 whitespace-nowrap sm:flex-none"
                >
                  {t("preview.exportCsv")}
                </button>
              </div>
            )}
          </div>

          {records.length > 0 ? (
            <>
              {isPreviewStale && (
                <p
                  role="status"
                  className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                >
                  {t("preview.staleWarning")}
                </p>
              )}

              <PreviewTable records={records} />
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-outline bg-canvas px-6 py-12 text-center">
              <p className="text-sm font-medium text-ink">
                {t("preview.emptyTitle")}
              </p>
              <p className="mt-2 text-sm text-muted">
                {t("preview.emptyDescription")}
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
