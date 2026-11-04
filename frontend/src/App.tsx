import { useState } from "react";

import { generateData } from "./api/generatorApi";
import { validateFields } from "./utils/validateFields";

import type { Preset, CustomField, GeneratedRecord } from "./types/generator";

import PreviewTable from "./components/PreviewTable";
import CustomFieldEditor from "./components/CustomFieldEditor";
import { exportJson, exportCsv } from "./utils/exportData";

function App() {
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

  const currentConfig = JSON.stringify(
    mode === "quick" ? { mode, count, preset } : { mode, count, fields },
  );

  const handleAddField = () => {
    setFields((previous) => {
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
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    setError("");

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

      const data = await generateData(mode, payload);

      setRecords(data);
      setGeneratedConfig(currentConfig);
    } catch (error) {
      console.error(error);
      setError("Unable to generate data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Data Forge</h1>

        <p className="mt-2 text-sm text-zinc-500">
          Generate fake data for testing.
        </p>
      </header>

      <div className="flex flex-col gap-6 rounded-xl border border-outline bg-surface p-6 shadow-sm">
        <div
          className="flex w-fit gap-1 rounded-lg bg-surface-soft p-1"
          role="group"
          aria-label="Generation mode"
        >
          <button
            type="button"
            aria-pressed={mode === "quick"}
            onClick={() => setMode("quick")}
            className={`mode-tab rounded-md px-4 py-2 text-sm font-medium ${
              mode === "quick"
                ? "bg-white text-zinc-900 shadow-sm"
                : "bg-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Quick Preset
          </button>

          <button
            type="button"
            aria-pressed={mode === "custom"}
            onClick={() => setMode("custom")}
            className={`mode-tab rounded-md px-4 py-2 text-sm font-medium ${
              mode === "custom"
                ? "bg-white text-zinc-900 shadow-sm"
                : "bg-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Custom Fields
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {mode === "quick" && (
            <div className="flex items-center gap-3">
              <label htmlFor="preset" className="text-sm font-medium text-ink">
                Preset
              </label>

              <select
                id="preset"
                value={preset}
                onChange={(event) => setPreset(event.target.value as Preset)}
                className="w-56 rounded-md border border-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="users">Users</option>
                <option value="products">Products</option>
                <option value="employees">Employees</option>
                <option value="umamusume">Umamusume</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label htmlFor="count" className="text-sm font-medium text-ink">
              Number of records
            </label>

            <input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="w-28 rounded-md border border-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {mode === "custom" && (
          <CustomFieldEditor fields={fields} setFields={setFields} />
        )}

        <div className="flex items-center justify-between gap-4">
          {mode === "custom" && (
            <button
              type="button"
              onClick={handleAddField}
              className="rounded-md border border-dashed border-outline px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:border-accent hover:bg-surface-soft"
            >
              Add Field
            </button>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={
              loading || !Number.isInteger(count) || count < 1 || count > 1000
            }
            className="ml-auto rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Data"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <section className="mt-8 rounded-xl border border-outline bg-surface p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">Data Preview</h2>
            <p className="mt-1 text-sm text-muted">
              {records.length} generated records
            </p>
          </div>

          {records.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleExportJson}
                className="rounded-md border border-outline px-4 py-2 text-sm font-medium hover:bg-surface-soft"
              >
                Export JSON
              </button>
              <button
                onClick={handleExportCsv}
                className="rounded-md border border-outline px-4 py-2 text-sm font-medium hover:bg-surface-soft"
              >
                Export CSV
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
                Configuration changed. Generate again to update the preview.
              </p>
            )}

            <PreviewTable records={records} />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-outline bg-canvas px-6 py-12 text-center">
            <p className="text-sm font-medium text-ink">
              Your data will appear here
            </p>
            <p className="mt-2 text-sm text-muted">
              Configure your dataset and click Generate Data.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
