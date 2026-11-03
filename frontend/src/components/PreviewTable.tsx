import type { GeneratedRecord } from "../types/generator";

type PreviewTableProps = {
  records: GeneratedRecord[];
};

export default function PreviewTable({ records }: PreviewTableProps) {
  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return (
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
  );
}
