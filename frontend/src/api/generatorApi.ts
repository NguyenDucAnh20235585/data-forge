import type { Preset, CustomField, GeneratedRecord } from "../types/generator";

type GeneratePayload =
  | { count: number; preset: Preset }
  | { count: number; fields: CustomField[] };

type DataLocale = "en" | "vi" | "ja";

export async function generateData(
  mode: "quick" | "custom",
  payload: GeneratePayload,
  locale: DataLocale,
): Promise<GeneratedRecord[]> {
  const endpoint =
    mode === "quick"
      ? "http://localhost:3000/generate"
      : "http://localhost:3000/generate/custom";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, locale }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details);
  }

  return response.json();
}
