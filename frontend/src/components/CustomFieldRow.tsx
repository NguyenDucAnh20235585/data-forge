import { useId } from "react";
import type { CustomField } from "../types/generator";
import type { FieldValidationError } from "../utils/validateFields";
import { useTranslation } from "react-i18next";

type CustomFieldRowProps = {
  field: CustomField;
  onNameChange: (name: string) => void;
  onTypeChange: (type: CustomField["type"]) => void;
  onConfigChange: (changes: Partial<CustomField>) => void;
  errors: FieldValidationError[];
  onRemove: () => void;
  canRemove: boolean;
};

const PATTERN_TEMPLATES = [
  { label: "Order ID", value: "ORD-{digits:6}" },
  { label: "User Code", value: "USR-{letters:4}" },
  { label: "Invoice", value: "INV-{digits:8}" },
  { label: "Product SKU", value: "SKU-{letters:3}-{digits:4}" },
];

export default function CustomFieldRow({
  field,
  onNameChange,
  onTypeChange,
  onConfigChange,
  errors,
  onRemove,
  canRemove,
}: CustomFieldRowProps) {
  const { t } = useTranslation();
  const nameErrorId = useId();
  const configErrorId = useId();

  const nameError = errors.find((error) => error.target === "name");
  const configError = errors.find((error) => error.target === "config");

  const hasNameError = Boolean(nameError);
  const hasConfigError = Boolean(configError);
  const needsConfig = [
    "number",
    "string",
    "choice",
    "date",
    "pattern",
  ].includes(field.type);

  const baseInputClass =
    "h-10 w-full min-w-0 rounded-md border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";

  const normalBorder = "border-control-outline";
  const errorBorder = "border-red-500";

  return (
    <div
      className="relative grid w-full
  grid-cols-1
  min-[600px]:grid-cols-2
  xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,2.2fr)]
  gap-x-3 gap-y-2 rounded-lg border border-outline
  bg-canvas p-3 pr-14"
    >
      <div className="min-w-0">
        <input
          data-error-target="name"
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
          <option value="firstName">{t("fieldEditor.types.firstName")}</option>
          <option value="lastName">{t("fieldEditor.types.lastName")}</option>
          <option value="city">{t("fieldEditor.types.city")}</option>
          <option value="country">{t("fieldEditor.types.country")}</option>
          <option value="url">{t("fieldEditor.types.url")}</option>
          <option value="ipv4">{t("fieldEditor.types.ipv4")}</option>
          <option value="uuid">{t("fieldEditor.types.uuid")}</option>
          <option value="boolean">{t("fieldEditor.types.boolean")}</option>
        </select>
      </div>

      <div
        data-error-target="config"
        className={`min-w-0
  min-[600px]:col-span-2
  xl:col-span-1 xl:col-start-3 xl:row-start-1
  ${needsConfig ? "" : "hidden xl:block"}`}
      >
        {field.type === "number" && (
          <div className="grid w-full min-w-0 grid-cols-2 gap-3 xl:h-10">
            <label className="flex min-w-0 flex-col gap-1 text-sm text-muted xl:flex-row xl:items-center xl:gap-2">
              <span className="shrink-0 xl:w-12">{t("fieldEditor.min")}</span>
              <input
                type="number"
                placeholder="1"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`h-10 w-full min-w-0 rounded-md border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${
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

            <label className="flex min-w-0 flex-col gap-1 text-sm text-muted xl:flex-row xl:items-center xl:gap-2">
              <span className="shrink-0 xl:w-12">{t("fieldEditor.max")}</span>
              <input
                type="number"
                placeholder="100"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`h-10 w-full min-w-0 rounded-md border bg-surface px-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${
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
            <label className="flex min-w-0 items-center gap-2 text-sm text-muted">
              <span className="xl:w-12 xl:shrink-0">
                {t("fieldEditor.length")}
              </span>
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
              <span className="xl:w-12 xl:shrink-0">
                {t("fieldEditor.options")}
              </span>
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
          <div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[600px]:grid-cols-2">
            <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-muted xl:flex-row xl:items-center xl:gap-2">
              <span className="shrink-0 xl:w-12">{t("fieldEditor.start")}</span>
              <input
                type="date"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`${baseInputClass} tabular-nums px-2 ${
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

            <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-muted xl:flex-row xl:items-center xl:gap-2">
              <span className="shrink-0 xl:w-12">{t("fieldEditor.end")}</span>
              <input
                type="date"
                aria-invalid={hasConfigError}
                aria-describedby={hasConfigError ? configErrorId : undefined}
                className={`${baseInputClass} tabular-nums px-2 ${
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
          <div className="xl:pl-14">
            <input
              type="text"
              placeholder="PLR-{letters:4}-{digits:6}"
              aria-invalid={hasConfigError}
              aria-describedby={hasConfigError ? configErrorId : undefined}
              className={`${baseInputClass} ${
                hasConfigError ? errorBorder : normalBorder
              }`}
              value={field.pattern ?? ""}
              onChange={(event) => {
                onConfigChange({
                  pattern: event.target.value,
                });
              }}
            />
          </div>
        )}

        {!["number", "string", "choice", "date", "pattern"].includes(
          field.type,
        ) && <div className="h-10" />}
      </div>

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center">
        <button
          type="button"
          disabled={!canRemove}
          onClick={onRemove}
          aria-label={t("fieldEditor.remove")}
          title={t("fieldEditor.remove")}
          className="
      group inline-flex h-10 w-10 items-center justify-center
      rounded-lg border border-transparent text-muted
      transition-[background-color,border-color,color,transform]
      duration-200 ease-out
      hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500
      active:scale-90
      focus-visible:outline-2 focus-visible:outline-offset-2
      focus-visible:outline-accent
      disabled:cursor-not-allowed disabled:opacity-40
      motion-reduce:transition-none
    "
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="
        transition-transform duration-200 ease-out
        group-hover:-rotate-12
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
          </svg>
        </button>
      </div>

      {(errors.length > 0 ||
        field.type === "choice" ||
        field.type === "pattern") && (
        <div className="col-span-full text-left">
          {nameError && (
            <p
              id={nameErrorId}
              role="alert"
              className="text-xs leading-5 text-red-600 dark:text-red-400"
            >
              {t(nameError.messageKey, { name: field.name })}
            </p>
          )}

          {configError && (
            <p
              id={configErrorId}
              role="alert"
              className="text-xs leading-5 text-red-600 dark:text-red-400"
            >
              {t(configError.messageKey, { name: field.name })}
            </p>
          )}

          {!configError && field.type === "choice" && (
            <p className="text-xs leading-5 text-muted">
              {t("fieldEditor.choiceHint")}
            </p>
          )}

          {field.type === "pattern" && (
            <details className="group">
              <summary className="cursor-pointer select-none text-sm font-medium text-muted transition-colors hover:text-accent">
                {t("fieldEditor.quickTemplates")}
              </summary>

              <div className="mt-3 space-y-3">
                <p className="text-xs leading-5 text-muted">
                  {t("fieldEditor.patternHint")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {PATTERN_TEMPLATES.map((template) => (
                    <button
                      key={template.label}
                      type="button"
                      onClick={() =>
                        onConfigChange({ pattern: template.value })
                      }
                      className="rounded-md border border-control-outline bg-surface px-3 py-1.5 text-xs text-ink transition-colors hover:border-accent"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
