import type { Preset, CustomField, GeneratedRecord } from "../types/generator";
import { readNdjson } from "./readNdjson";

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

export async function generateCustomDataStream(
  payload: { count: number; fields: CustomField[] },
  locale: DataLocale,
  onProgress: (
    completed: number,
    total: number,
    partialRecords: GeneratedRecord[],
  ) => void,
  signal?: AbortSignal,
): Promise<GeneratedRecord[]> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is required in production.");
  }

  const response = await fetch(`${API_BASE_URL}/generate/custom/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, locale }),
    signal,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (!response.body) {
    throw new Error("Streaming response is unavailable.");
  }

  const records: GeneratedRecord[] = [];
  let receivedDone = false;

  await readNdjson(response.body, (event) => {
    if (receivedDone) {
      throw new Error("Unexpected event after completion.");
    }

    if (event.type === "error") {
      throw new Error(event.message);
    }

    if (event.type === "batch") {
      const expectedCompleted = records.length + event.records.length;

      if (
        event.total !== payload.count ||
        event.records.length === 0 ||
        event.completed !== expectedCompleted ||
        expectedCompleted > payload.count
      ) {
        throw new Error("Invalid streaming progress.");
      }

      records.push(...event.records);

      onProgress(records.length, payload.count, [...records]);
    }

    if (event.type === "done") {
      if (
        event.total !== payload.count ||
        event.completed !== payload.count ||
        records.length !== payload.count
      ) {
        throw new Error("Incomplete streaming response.");
      }

      receivedDone = true;
    }
  });

  if (!receivedDone) {
    throw new Error("Stream ended without completion.");
  }

  return records;
}
