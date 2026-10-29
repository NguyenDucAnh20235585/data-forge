import { useState } from "react";
import "./App.css";

type Preset = "users" | "products" | "employees";

type GeneratedRecord = {
  id: string;
  [key: string]: string | number;
};

function App() {
  const [preset, setPreset] = useState<Preset>("users");
  const [count, setCount] = useState(3);
  const [records, setRecords] = useState<GeneratedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const columns =
    records.length > 0
      ? Object.keys(records[0]).filter((key) => key !== "id")
      : [];

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count, preset }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate data");
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
        <label htmlFor="preset">Preset:</label>
        <select
          id="preset"
          value={preset}
          onChange={(event) => setPreset(event.target.value as Preset)}
        >
          <option value="users">Users</option>
          <option value="products">Products</option>
          <option value="employees">Employees</option>
        </select>

        <label htmlFor="count">Number of records:</label>
        <input
          id="count"
          type="number"
          min="1"
          max="1000"
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />

        <button
          onClick={handleGenerate}
          disabled={
            loading || !Number.isInteger(count) || count < 1 || count > 1000
          }
        >
          {loading ? "Generating..." : "Generate Data"}
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {records.length > 0 && (
        <section>
          <h2>Generated Records ({records.length})</h2>

          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
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
