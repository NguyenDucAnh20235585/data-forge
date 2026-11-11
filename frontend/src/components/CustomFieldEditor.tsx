import type { Dispatch, SetStateAction } from "react";
import type { CustomField } from "../types/generator";
import CustomFieldRow from "./CustomFieldRow";
import type { FieldValidationError } from "../utils/validateFields";
import { useTranslation } from "react-i18next";

type CustomFieldEditorProps = {
  fields: CustomField[];
  fieldErrors: FieldValidationError[];
  setFields: Dispatch<SetStateAction<CustomField[]>>;
};

export default function CustomFieldEditor({
  fields,
  setFields,
  fieldErrors,
}: CustomFieldEditorProps) {
  const { t } = useTranslation();
  return (
    <section>
      <h2 className="mb-3">{t("configuration.customFields")}</h2>

      {fields.map((field, index) => (
        <div key={index} className="mb-2 last:mb-0">
          <CustomFieldRow
            field={field}
            errors={fieldErrors.filter((error) => error.fieldIndex === index)}
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
    </section>
  );
}
