import type { GeneratedRecord } from "../types/generator";

type PreviewTableProps = {
  records: GeneratedRecord[];
};

export default function PreviewTable({ records }: PreviewTableProps) {
  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return (
    <div className="max-h-[420px] w-full overflow-auto rounded-lg border border-outline">
      <table className="w-full min-w-max border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-surface-soft">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-outline px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {records.map((record, index) => (
            <tr
              key={index}
              className="border-b border-outline/70 transition-colors hover:bg-surface-soft/50 last:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className="whitespace-nowrap px-4 py-3 text-ink"
                >
                  {String(record[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
