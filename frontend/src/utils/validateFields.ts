import type { CustomField } from "../types/generator";

export type FieldValidationError = {
  fieldIndex: number;
  target: "name" | "config";
  messageKey: string;
};

function isInvalidPattern(pattern?: string): boolean {
  if (!pattern?.trim()) return true;

  let hasInvalidToken = false;

  const remaining = pattern
    .replace(/\{digits:(\d+)\}/g, (_match, rawLength: string) => {
      const length = Number(rawLength);

      if (!Number.isInteger(length) || length < 1 || length > 100) {
        hasInvalidToken = true;
      }

      return "";
    })
    .replace(/\{letters:(\d+)\}/g, (_match, rawLength: string) => {
      const length = Number(rawLength);

      if (!Number.isInteger(length) || length < 1 || length > 100) {
        hasInvalidToken = true;
      }

      return "";
    })
    .replace(/\{choice:([^{}]+)\}/g, (_match, rawOptions: string) => {
      const options = rawOptions.split("|").map((option) => option.trim());

      if (options.length < 2 || options.some((option) => option === "")) {
        hasInvalidToken = true;
      }

      return "";
    });

  return hasInvalidToken || /[{}]/.test(remaining);
}

export function validateAllFields(
  fields: CustomField[],
): FieldValidationError[] {
  const errors: FieldValidationError[] = [];

  const names = fields.map((field) => field.name.trim().toLowerCase());

  const nameCounts = new Map<string, number>();

  names.forEach((name) => {
    if (name) {
      nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
    }
  });

  const addError = (
    fieldIndex: number,
    target: FieldValidationError["target"],
    messageKey: string,
  ) => {
    errors.push({ fieldIndex, target, messageKey });
  };

  fields.forEach((field, index) => {
    const name = names[index];

    if (!name) {
      addError(index, "name", "validation.emptyName");
    } else if ((nameCounts.get(name) ?? 0) > 1) {
      addError(index, "name", "validation.duplicateName");
    }

    switch (field.type) {
      case "number": {
        const min = field.min ?? 1;
        const max = field.max ?? 100;

        if (
          !Number.isSafeInteger(min) ||
          !Number.isSafeInteger(max) ||
          min > max
        ) {
          addError(index, "config", "validation.invalidNumber");
        }
        break;
      }

      case "string": {
        const length = field.length ?? 8;

        if (!Number.isInteger(length) || length < 1 || length > 100) {
          addError(index, "config", "validation.invalidString");
        }
        break;
      }

      case "choice": {
        if (
          !field.options?.length ||
          field.options.some((option) => option.trim() === "")
        ) {
          addError(index, "config", "validation.invalidChoice");
        }
        break;
      }

      case "date": {
        if (
          !field.startDate ||
          !field.endDate ||
          field.startDate > field.endDate
        ) {
          addError(index, "config", "validation.invalidDate");
        }
        break;
      }

      case "pattern": {
        if (isInvalidPattern(field.pattern)) {
          addError(index, "config", "validation.invalidPattern");
        }
        break;
      }
    }
  });

  return errors;
}

// Keep the existing API working during migration.
export function validateFields(
  fields: CustomField[],
): FieldValidationError | null {
  return validateAllFields(fields)[0] ?? null;
}
