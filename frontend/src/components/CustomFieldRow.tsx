import type { CustomField } from "../types/generator";

type CustomFieldRowProps = {
  field: CustomField;
  onNameChange: (name: string) => void;
  onTypeChange: (type: CustomField["type"]) => void;
  onConfigChange: (changes: Partial<CustomField>) => void;
  onRemove: () => void;
  canRemove: boolean;
};

export default function CustomFieldRow({
  field,
  onNameChange,
  onTypeChange,
  onConfigChange,
  onRemove,
  canRemove,
}: CustomFieldRowProps) {
  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,2.5fr)_auto] items-center gap-3 rounded-lg border border-outline bg-surface p-3">
      <input
        className="w-full min-w-0 rounded-md border border-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        value={field.name}
        onChange={(event) => onNameChange(event.target.value)}
      />
      <select
        className="w-full min-w-0 rounded-md border border-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
        value={field.type}
        onChange={(event) =>
          onTypeChange(event.target.value as CustomField["type"])
        }
      >
        <option value="personName">Person Name</option>
        <option value="productName">Product Name</option>
        <option value="companyName">Company Name</option>
        <option value="number">Number</option>
        <option value="email">Email</option>
        <option value="string">String</option>
        <option value="choice">Choice</option>
        <option value="phoneNumber">Phone Number</option>
        <option value="date">Date</option>
        <option value="pattern">Pattern</option>
      </select>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {field.type === "number" && (
          <label className="flex items-center gap-2 text-sm text-muted">
            Min:
            <input
              className="w-20 rounded-md border border-outline bg-surface px-2 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="number"
              value={field.min ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onConfigChange({
                  min: value === "" ? undefined : Number(value),
                });
              }}
            />
          </label>
        )}
        {field.type === "number" && (
          <label className="flex items-center gap-2 text-sm text-muted">
            Max:
            <input
              className="w-20 rounded-md border border-outline bg-surface px-2 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="number"
              value={field.max ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onConfigChange({
                  max: value === "" ? undefined : Number(value),
                });
              }}
            />
          </label>
        )}
        {field.type === "string" && (
          <label className="flex items-center gap-2 text-sm text-muted">
            Length:
            <input
              className="w-20 rounded-md border border-outline bg-surface px-2 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="number"
              min="1"
              max="100"
              value={field.length ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onConfigChange({
                  length: value === "" ? undefined : Number(value),
                });
              }}
            />
          </label>
        )}
        {field.type === "choice" && (
          <label className="flex w-full min-w-0 items-center gap-2 text-sm text-muted">
            Options:
            <input
              className="min-w-0 flex-1 rounded-md border border-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="text"
              value={(field.options ?? []).join(",")}
              onChange={(event) => {
                const options = event.target.value.split(",");
                onConfigChange({ options });
              }}
            />
          </label>
        )}
        {field.type === "date" && (
          <label className="flex items-center gap-2 text-sm text-muted">
            Start Date:
            <input
              className="min-w-0 rounded-md border border-outline bg-surface px-2 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="date"
              value={field.startDate ?? ""}
              onChange={(event) => {
                onConfigChange({
                  startDate: event.target.value,
                });
              }}
            />
          </label>
        )}
        {field.type === "date" && (
          <label className="flex items-center gap-2 text-sm text-muted">
            End Date:
            <input
              className="min-w-0 rounded-md border border-outline bg-surface px-2 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="date"
              value={field.endDate ?? ""}
              onChange={(event) => {
                onConfigChange({
                  endDate: event.target.value,
                });
              }}
            />
          </label>
        )}
        {field.type === "pattern" && (
          <input
            className="w-full min-w-0 rounded-md border border-outline bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            type="text"
            placeholder="PLR-{letters:4}-{digits:6}"
            value={field.pattern ?? ""}
            onChange={(event) => {
              onConfigChange({
                pattern: event.target.value,
              });
            }}
          />
        )}
      </div>
      <button
        type="button"
        disabled={!canRemove}
        onClick={onRemove}
        className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Remove
      </button>
    </div>
  );
}
