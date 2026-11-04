import { useState } from "react";
import "./App.css";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"quick" | "custom">("quick");

  const [fields, setFields] = useState<CustomField[]>([
    { name: "playerName", type: "personName" },
  ]);

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
