import type { GeneratedRecord } from "../types/generator";
import { useTranslation } from "react-i18next";

type PreviewTableProps = {
  records: GeneratedRecord[];
};

function formatPreviewValue(
  column: string,
  value: string | number | boolean,
  locale: string,
) {
  if (
    (column === "timestamp" || column === "createdAt") &&
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T.*Z$/.test(value)
  ) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString(locale, {
        hour12: false,
      });
    }
  }

  return String(value);
}

export default function PreviewTable({ records }: PreviewTableProps) {
  const { i18n } = useTranslation();
  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return (
    <div className="max-h-[420px] w-full overflow-auto rounded-lg border border-outline lg:max-h-[min(65vh,560px)] [scrollbar-width:thin]">
      <table className="w-full min-w-max border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-surface-soft">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-outline px-4 py-3 text-xs font-semibold text-muted"
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
                  {formatPreviewValue(
                    column,
                    record[column],
                    i18n.resolvedLanguage ?? "en",
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
