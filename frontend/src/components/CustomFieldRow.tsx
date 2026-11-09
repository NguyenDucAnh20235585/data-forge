import { useId } from "react";
import type { CustomField } from "../types/generator";
import type { FieldValidationError } from "../utils/validateFields";
import { useTranslation } from "react-i18next";

type CustomFieldRowProps = {
  field: CustomField;
  onNameChange: (name: string) => void;
  onTypeChange: (type: CustomField["type"]) => void;
  onConfigChange: (changes: Partial<CustomField>) => void;
  error: FieldValidationError | null;
  onRemove: () => void;
  canRemove: boolean;
};

export default function CustomFieldRow({
  field,
  onNameChange,
  onTypeChange,
  onConfigChange,
  error,
  onRemove,
  canRemove,
}: CustomFieldRowProps) {
  const { t } = useTranslation();
  const nameErrorId = useId();
  const configErrorId = useId();

  const hasNameError = error?.target === "name";
  const hasConfigError = error?.target === "config";

  const baseInputClass =
    "h-10 w-full min-w-0 rounded-md border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";

  const normalBorder = "border-control-outline";
  const errorBorder = "border-red-500";

  return (
    <div
      className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,2.2fr)_auto] 
    gap-x-3 gap-y-2 rounded-lg border border-outline bg-canvas p-3"
    >
      <div className="min-w-0">
        <input
          aria-label={t("fieldEditor.fieldName")}
          aria-invalid={hasNameError}
          aria-describedby={hasNameError ? nameErrorId : undefined}
          className={`${baseInputClass} ${hasNameError ? errorBorder : normalBorder}`}
          value={field.name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>

      <div className="min-w-0">
        <select
          aria-label={t("fieldEditor.fieldType")}
          className={`${baseInputClass} ${normalBorder}`}
          value={field.type}
          onChange={(event) =>
            onTypeChange(event.target.value as CustomField["type"])
          }
        >
          <option value="personName">
            {t("fieldEditor.types.personName")}
          </option>
          <option value="productName">
            {t("fieldEditor.types.productName")}
          </option>
          <option value="companyName">
            {t("fieldEditor.types.companyName")}
          </option>
          <option value="number">{t("fieldEditor.types.number")}</option>
          <option value="email">{t("fieldEditor.types.email")}</option>
          <option value="string">{t("fieldEditor.types.string")}</option>
          <option value="choice">{t("fieldEditor.types.choice")}</option>
          <option value="phoneNumber">
            {t("fieldEditor.types.phoneNumber")}
          </option>
          <option value="date">{t("fieldEditor.types.date")}</option>
          <option value="pattern">{t("fieldEditor.types.pattern")}</option>
        </select>
      </div>

      <div className="min-w-0">
        {field.type === "number" && (
          <div className="flex h-10 items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted">
              <span>{t("fieldEditor.min")}</span>
              <input
                type="number"
                placeholder="1"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`h-10 w-22 rounded-md border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${
                  hasConfigError ? errorBorder : normalBorder
                }`}
                value={field.min ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  onConfigChange({
                    min: value === "" ? undefined : Number(value),
                  });
                }}
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-muted">
              <span>{t("fieldEditor.max")}</span>
              <input
                type="number"
                placeholder="100"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`h-10 w-22 rounded-md border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${
                  hasConfigError ? errorBorder : normalBorder
                }`}
                value={field.max ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  onConfigChange({
                    max: value === "" ? undefined : Number(value),
                  });
                }}
              />
            </label>
          </div>
        )}

        {field.type === "string" && (
          <div className="flex h-10 items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              <span>{t("fieldEditor.length")}</span>
              <input
                type="number"
                min="1"
                max="100"
                placeholder="8"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`h-10 w-24 rounded-md border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${
                  hasConfigError ? errorBorder : normalBorder
                }`}
                value={field.length ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  onConfigChange({
                    length: value === "" ? undefined : Number(value),
                  });
                }}
              />
            </label>
          </div>
        )}

        {field.type === "choice" && (
          <div className="flex h-10 items-center gap-2">
            <label className="flex w-full min-w-0 items-center gap-2 text-sm text-muted">
              <span>{t("fieldEditor.options")}</span>
              <input
                type="text"
                placeholder={t("fieldEditor.choicePlaceholder")}
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`${baseInputClass} ${hasConfigError ? errorBorder : normalBorder}`}
                value={(field.options ?? []).join(",")}
                onChange={(event) => {
                  const options = event.target.value.split(",");
                  onConfigChange({ options });
                }}
              />
            </label>
          </div>
        )}

        {field.type === "date" && (
          <div className="flex h-10 w-full min-w-0 items-center gap-3">
            <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted">
              <span className="shrink-0">{t("fieldEditor.start")}</span>
              <input
                type="date"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`${baseInputClass} flex-1 px-2 ${
                  hasConfigError ? errorBorder : normalBorder
                }`}
                value={field.startDate ?? ""}
                onChange={(event) => {
                  onConfigChange({
                    startDate: event.target.value,
                  });
                }}
              />
            </label>

            <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-muted">
              <span className="shrink-0">{t("fieldEditor.end")}</span>
              <input
                type="date"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`${baseInputClass} flex-1 px-2 ${
                  hasConfigError ? errorBorder : normalBorder
                }`}
                value={field.endDate ?? ""}
                onChange={(event) => {
                  onConfigChange({
                    endDate: event.target.value,
                  });
                }}
              />
            </label>
          </div>
        )}

        {field.type === "pattern" && (
          <input
            type="text"
            placeholder="PLR-{letters:4}-{digits:6}"
            aria-invalid={hasConfigError}
            aria-describedby={hasConfigError ? configErrorId : undefined}
            className={`${baseInputClass} ${hasConfigError ? errorBorder : normalBorder}`}
            value={field.pattern ?? ""}
            onChange={(event) => {
              onConfigChange({
                pattern: event.target.value,
              });
            }}
          />
        )}

        {!["number", "string", "choice", "date", "pattern"].includes(
          field.type,
        ) && <div className="h-10" />}
      </div>

      <div className="flex items-start">
        <button
          type="button"
          disabled={!canRemove}
          onClick={onRemove}
          className="h-10 rounded-md px-3 text-sm font-medium text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("fieldEditor.remove")}
        </button>
      </div>

      {(error !== null ||
        field.type === "choice" ||
        field.type === "pattern") && (
        <div className="col-span-full text-left">
          {hasNameError && (
            <p
              id={nameErrorId}
              role="alert"
              className="text-xs leading-5 text-red-600"
            >
              {t(error.messageKey, { name: field.name })}
            </p>
          )}

          {hasConfigError && (
            <p
              id={configErrorId}
              role="alert"
              className="text-xs leading-5 text-red-600"
            >
              {t(error.messageKey, { name: field.name })}
            </p>
          )}

          {!error && field.type === "choice" && (
            <p className="text-xs leading-5 text-muted">
              {t("fieldEditor.choiceHint")}
            </p>
          )}

          {!error && field.type === "pattern" && (
            <p className="text-xs leading-5 text-muted">
              {t("fieldEditor.patternHint")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
