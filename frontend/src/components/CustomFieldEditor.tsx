import type { Dispatch, SetStateAction } from "react";
import type { CustomField } from "../types/generator";
import CustomFieldRow from "./CustomFieldRow";

type CustomFieldEditorProps = {
  fields: CustomField[];
  setFields: Dispatch<SetStateAction<CustomField[]>>;
};

export default function CustomFieldEditor({
  fields,
  setFields,
}: CustomFieldEditorProps) {
  return (
    <section>
      <h2>Custom Fields</h2>

      {fields.map((field, index) => (
        <div key={index}>
          <CustomFieldRow
            field={field}
            onNameChange={(name) => {
              setFields((previous) =>
                previous.map((item, i) =>
                  i === index ? { ...item, name } : item,
                ),
              );
            }}
            onTypeChange={(type) => {
              setFields((previous) =>
                previous.map((item, i) =>
                  i === index ? { ...item, type } : item,
                ),
              );
            }}
            onConfigChange={(changes) => {
              setFields((previous) =>
                previous.map((item, i) =>
                  i === index ? { ...item, ...changes } : item,
                ),
              );
            }}
            onRemove={() =>
              setFields((previous) => previous.filter((_, i) => i !== index))
            }
            canRemove={fields.length > 1}
          />

          {field.type === "date" && (
            <label>
              Start Date:
              <input
                type="date"
                value={field.startDate ?? ""}
                onChange={(event) => {
                  setFields(
                    fields.map((item, i) =>
                      i === index
                        ? { ...item, startDate: event.target.value }
                        : item,
                    ),
                  );
                }}
              />
            </label>
          )}
          {field.type === "date" && (
            <label>
              End Date:
              <input
                type="date"
                value={field.endDate ?? ""}
                onChange={(event) => {
                  setFields(
                    fields.map((item, i) =>
                      i === index
                        ? { ...item, endDate: event.target.value }
                        : item,
                    ),
                  );
                }}
              />
            </label>
          )}
          {field.type === "pattern" && (
            <input
              type="text"
              placeholder="PLR-{letters:4}-{digits:6}"
              value={field.pattern ?? ""}
              onChange={(event) =>
                setFields((previous) =>
                  previous.map((item, i) =>
                    i === index
                      ? { ...item, pattern: event.target.value }
                      : item,
                  ),
                )
              }
            />
          )}
        </div>
      ))}

      <button
        onClick={() => {
          let next = 2;

          while (
            fields.some(
              (field) => field.name.trim().toLowerCase() === `field${next}`,
            )
          ) {
            next++;
          }

          setFields([...fields, { name: `field${next}`, type: "number" }]);
        }}
      >
        Add Field
      </button>
    </section>
  );
}
