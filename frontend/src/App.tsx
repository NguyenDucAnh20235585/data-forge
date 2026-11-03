import { useState } from "react";
import "./App.css";

import type { Preset, CustomField, GeneratedRecord } from "./types/generator";

import PreviewTable from "./components/PreviewTable";
import CustomFieldEditor from "./components/CustomFieldEditor";

function App() {
  const [preset, setPreset] = useState<Preset>("users");
  const [count, setCount] = useState(3);
  const [records, setRecords] = useState<GeneratedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"quick" | "custom">("quick");

  const [fields, setFields] = useState<CustomField[]>([
    { name: "playerName", type: "personName" },
  ]);

  const handleExportJson = () => {
    if (records.length === 0) return;

    const json = JSON.stringify(records, null, 2);

    const blob = new Blob([json], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data-forge.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    if (records.length === 0) return;

    const headers = Object.keys(records[0]);

    const rows = records.map((record) =>
      headers.map((header) => record[header]),
    );

    const escapeCsvCell = (value: string | number): string =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCsvCell).join(","),
      ...rows.map((row) => row.map(escapeCsvCell).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data-forge.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    if (mode === "custom") {
      const hasEmptyName = fields.some((field) => field.name.trim() === "");

      if (hasEmptyName) {
        setError("Field name cannot be empty.");
        return;
      }
      const names = fields.map((field) => field.name.trim().toLowerCase());

      const hasDuplicates = new Set(names).size !== names.length;

      const hasInvalidRange = fields.some((field) => {
        if (field.type !== "number") return false;

        const min = field.min ?? 1;
        const max = field.max ?? 100;

        return (
          !Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max
        );
      });

      const hasInvalidLength = fields.some((field) => {
        if (field.type !== "string") return false;

        const length = field.length ?? 8;

        return !Number.isInteger(length) || length < 1 || length > 100;
      });

      const hasInvalidOptions = fields.some((field) => {
        if (field.type !== "choice") return false;

        if (!field.options || field.options.length === 0) {
          return true;
        }

        return field.options.some((option) => option.trim() === "");
      });

      const hasInvalidDateRange = fields.some((field) => {
        if (field.type !== "date") return false;

        if (!field.startDate || !field.endDate) {
          return true;
        }

        return field.startDate > field.endDate;
      });

      if (hasInvalidDateRange) {
        setError("Invalid date range. Check Start Date and End Date.");
        return;
      }

      if (hasInvalidRange) {
        setError("Invalid number range. Check Min and Max.");
        return;
      }

      if (hasInvalidLength) {
        setError("String length must be between 1 and 100.");
        return;
      }

      if (hasInvalidOptions) {
        setError("Choice must contain valid options.");
        return;
      }

      if (hasDuplicates) {
        setError("Field names must be unique.");
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      const endpoint =
        mode === "quick"
          ? "http://localhost:3000/generate"
          : "http://localhost:3000/generate/custom";

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
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details);
      }

      const data: GeneratedRecord[] = await response.json();
      setRecords(data);
    } catch (error) {
      console.error(error);
      setError("Unable to generate data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Data Forge</h1>
      <p>Generate fake data for testing.</p>

      <div>
        {mode === "quick" && (
          <>
            <label htmlFor="preset">Preset:</label>
            <select
              id="preset"
              value={preset}
              onChange={(event) => setPreset(event.target.value as Preset)}
            >
              <option value="users">Users</option>
              <option value="products">Products</option>
              <option value="employees">Employees</option>
              <option value="umamusume">Umamusume</option>
            </select>
          </>
        )}

        <label htmlFor="count">Number of records:</label>
        <input
          id="count"
          type="number"
          min="1"
          max="1000"
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />

        {mode === "custom" && (
          <CustomFieldEditor fields={fields} setFields={setFields} />
        )}

        <button onClick={() => setMode("quick")}>Quick Generate</button>

        <button onClick={() => setMode("custom")}>Custom Generate</button>

        <button
          onClick={handleGenerate}
          disabled={
            loading || !Number.isInteger(count) || count < 1 || count > 1000
          }
        >
          {loading ? "Generating..." : "Generate Data"}
        </button>
      </div>

      <p>
        {mode === "quick"
          ? "You are using Quick Generate"
          : "You are using Custom Generate"}
      </p>

      {error && <p role="alert">{error}</p>}

      {records.length > 0 && (
        <section>
          <h2>Generated Records ({records.length})</h2>

          <button onClick={handleExportJson}>Export JSON</button>
          <button onClick={handleExportCsv}>Export CSV</button>

          <PreviewTable records={records} />
        </section>
      )}
    </main>
  );
}

export default App;
