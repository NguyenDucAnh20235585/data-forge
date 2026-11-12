import type { GeneratedRecord } from "../types/generator";

export function exportJson(records: GeneratedRecord[]): void {
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
}

export function exportCsv(records: GeneratedRecord[]): void {
  if (records.length === 0) return;

  const headers = Object.keys(records[0]);

  const rows = records.map((record) => headers.map((header) => record[header]));

  const escapeCsvCell = (value: string | number | boolean): string => {
    const text = String(value);

    const isDangerous =
      typeof value === "string" &&
      (/^[=+\-@＝＋－＠]/u.test(text.trimStart()) ||
        text.startsWith("\t") ||
        text.startsWith("\r") ||
        text.startsWith("\n") ||
        text.startsWith("\0"));

    const safeText = isDangerous ? `'${text}` : text;

    return `"${safeText.replace(/"/g, '""')}"`;
  };

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
}
