import type { Preset, CustomField, GeneratedRecord } from "../types/generator";

type GeneratePayload =
  | { count: number; preset: Preset }
  | { count: number; fields: CustomField[] };

type DataLocale = "en" | "vi" | "ja";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3000" : "")
).replace(/\/+$/, "");

export async function generateData(
  mode: "quick" | "custom",
  payload: GeneratePayload,
  locale: DataLocale,
): Promise<GeneratedRecord[]> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is required in production.");
  }

  const endpoint =
    mode === "quick"
      ? `${API_BASE_URL}/generate`
      : `${API_BASE_URL}/generate/custom`;

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
