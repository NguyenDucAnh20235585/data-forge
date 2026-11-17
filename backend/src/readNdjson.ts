export type GenerationStreamEvent =
  | {
      type: 'batch';
      records: Record<string, string | number | boolean>[];
      completed: number;
      total: number;
    }
  | {
      type: 'done';
      completed: number;
      total: number;
    }
  | {
      type: 'error';
      message: string;
    };

export async function readNdjson(
  stream: ReadableStream<Uint8Array>,
  onEvent: (event: GenerationStreamEvent) => void,
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.trim()) {
          onEvent(JSON.parse(line) as GenerationStreamEvent);
        }
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      onEvent(JSON.parse(buffer) as GenerationStreamEvent);
    }
  } finally {
    reader.releaseLock();
  }
}
