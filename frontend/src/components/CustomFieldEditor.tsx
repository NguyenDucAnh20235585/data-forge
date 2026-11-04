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
