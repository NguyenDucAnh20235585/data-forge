import type { Dispatch, SetStateAction } from "react";
import type { CustomField } from "../types/generator";

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
          <input
            value={field.name}
            onChange={(event) => {
              const updatedFields = fields.map((item, i) =>
                i === index ? { ...item, name: event.target.value } : item,
              );

              setFields(updatedFields);
            }}
          />
          <button
            disabled={fields.length === 1}
            onClick={() => setFields(fields.filter((_, i) => i !== index))}
          >
            Remove
          </button>

          <select
            value={field.type}
            onChange={(event) => {
              const updatedFields = fields.map((item, i) =>
                i === index
                  ? {
                      ...item,
                      type: event.target.value as CustomField["type"],
                    }
                  : item,
              );

              setFields(updatedFields);
            }}
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

                  setFields(
                    fields.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            min: value === "" ? undefined : Number(value),
                          }
                        : item,
                    ),
                  );
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

                  setFields(
                    fields.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            max: value === "" ? undefined : Number(value),
                          }
                        : item,
                    ),
                  );
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

                  setFields(
                    fields.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            length: value === "" ? undefined : Number(value),
                          }
                        : item,
                    ),
                  );
                }}
              />
            </label>
          )}
          {field.type === "choice" && (
            <label>
              Options:
              <input
                type="text"
                value={(field.options ?? []).join(",")}
                onChange={(event) => {
                  const options = event.target.value.split(",");

                  setFields(
                    fields.map((item, i) =>
                      i === index ? { ...item, options } : item,
                    ),
                  );
                }}
              />
            </label>
          )}
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
