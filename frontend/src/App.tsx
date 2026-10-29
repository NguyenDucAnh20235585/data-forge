import { useState } from "react";
import "./App.css";

type FakeUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

function App() {
  const [count, setCount] = useState(3);
  const [users, setUsers] = useState<FakeUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate data");
      }

      const data: FakeUser[] = await response.json();
      setUsers(data);
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
        <label htmlFor="count">Number of records: </label>
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

      {users.length > 0 && (
        <section>
          <h2>Generated Users ({users.length})</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
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
