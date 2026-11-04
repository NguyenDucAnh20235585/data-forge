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
    <div>
      <input
        value={field.name}
        onChange={(event) => onNameChange(event.target.value)}
      />
      <select
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
      {field.type === "number" && (
        <label>
          Min:
          <input
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
        <label>
          Max:
          <input
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
        <label>
          Length:
          <input
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
      <button disabled={!canRemove} onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
