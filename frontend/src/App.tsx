import { useState } from "react";
import "./App.css";

type Preset = "users" | "products" | "employees" | "umamusume";

type CustomField = {
  name: string;
  type:
    | "personName"
    | "productName"
    | "companyName"
    | "number"
    | "email"
    | "string"
    | "choice"
    | "phoneNumber"
    | "date"
    | "pattern";
  min?: number;
  max?: number;
  length?: number;
  options?: string[];
  startDate?: string;
  endDate?: string;
  pattern?: string;
};

type GeneratedRecord = Record<string, string | number>;

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

  const columns = records.length > 0 ? Object.keys(records[0]) : [];

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

    console.log(headers);
    console.log(rows);

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
          <section>
            <h2>Custom Fields</h2>

            {fields.map((field, index) => (
              <div key={index}>
                <input
                  value={field.name}
                  onChange={(event) => {
                    const updatedFields = fields.map((item, i) =>
                      i === index
                        ? { ...item, name: event.target.value }
                        : item,
                    );

                    setFields(updatedFields);
                  }}
                />
                <button
                  disabled={fields.length === 1}
                  onClick={() =>
                    setFields(fields.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </button>

                <select
                  value={field.type}
                  onChange={(event) => {
                    const updatedFields = fields.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            type: event.target.value as CustomField["type"],
                          }
                        : item,
                    );

                    setFields(updatedFields);
                  }}
                >
                  <option value="personName">Person Name</option>
                  <option value="productName">Product Name</option>
                  <option value="companyName">Company Name</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="string">String</option>
                  <option value="choice">Choice</option>
                  <option value="phoneNumber">Phone Number</option>
                  <option value="date">Date</option>
                  <option value="pattern">Pattern</option>
                </select>
                {field.type === "number" && (
                  <label>
                    Min:
                    <input
                      type="number"
                      value={field.min ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;

                        setFields(
                          fields.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  min: value === "" ? undefined : Number(value),
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                  </label>
                )}

                {field.type === "number" && (
                  <label>
                    Max:
                    <input
                      type="number"
                      value={field.max ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;

                        setFields(
                          fields.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  max: value === "" ? undefined : Number(value),
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                  </label>
                )}

                {field.type === "string" && (
                  <label>
                    Length:
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={field.length ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;

                        setFields(
                          fields.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  length:
                                    value === "" ? undefined : Number(value),
                                }
                              : item,
                          ),
                        );
                      }}
                    />
                  </label>
                )}
                {field.type === "choice" && (
                  <label>
                    Options:
                    <input
                      type="text"
                      value={(field.options ?? []).join(",")}
                      onChange={(event) => {
                        const options = event.target.value.split(",");

                        setFields(
                          fields.map((item, i) =>
                            i === index ? { ...item, options } : item,
                          ),
                        );
                      }}
                    />
                  </label>
                )}
                {field.type === "date" && (
                  <label>
                    Start Date:
                    <input
                      type="date"
                      value={field.startDate ?? ""}
                      onChange={(event) => {
                        setFields(
                          fields.map((item, i) =>
                            i === index
                              ? { ...item, startDate: event.target.value }
                              : item,
                          ),
                        );
                      }}
                    />
                  </label>
                )}
                {field.type === "date" && (
                  <label>
                    End Date:
                    <input
                      type="date"
                      value={field.endDate ?? ""}
                      onChange={(event) => {
                        setFields(
                          fields.map((item, i) =>
                            i === index
                              ? { ...item, endDate: event.target.value }
                              : item,
                          ),
                        );
                      }}
                    />
                  </label>
                )}
                {field.type === "pattern" && (
                  <input
                    type="text"
                    placeholder="PLR-{letters:4}-{digits:6}"
                    value={field.pattern ?? ""}
                    onChange={(event) =>
                      setFields((previous) =>
                        previous.map((item, i) =>
                          i === index
                            ? { ...item, pattern: event.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                )}
              </div>
            ))}

            <button
              onClick={() => {
                let next = 2;

                while (
                  fields.some(
                    (field) =>
                      field.name.trim().toLowerCase() === `field${next}`,
                  )
                ) {
                  next++;
                }

                setFields([
                  ...fields,
                  { name: `field${next}`, type: "number" },
                ]);
              }}
            >
              Add Field
            </button>
          </section>
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
          <button onClick={handleExportJson} disabled={records.length === 0}>
            Export JSON
          </button>
          <button onClick={handleExportCsv}>Export CSV</button>
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column}>{record[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

export default App;
