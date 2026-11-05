import type { CustomField } from "../types/generator";

export function validateFields(fields: CustomField[]): string | null {
  const hasEmptyName = fields.some((field) => field.name.trim() === "");

  if (hasEmptyName) {
    return "Field name cannot be empty.";
  }

  const names = fields.map((field) => field.name.trim().toLowerCase());

  const hasDuplicates = new Set(names).size !== names.length;

  const invalidNumber = fields.find((field) => {
    if (field.type !== "number") return false;

    const min = field.min ?? 1;
    const max = field.max ?? 100;

    return (
      !Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max
    );
  });

  const invalidString = fields.find((field) => {
    if (field.type !== "string") return false;

    const length = field.length ?? 8;

    return !Number.isInteger(length) || length < 1 || length > 100;
  });

  const invalidChoice = fields.find((field) => {
    if (field.type !== "choice") return false;

    if (!field.options || field.options.length === 0) {
      return true;
    }

    return field.options.some((option) => option.trim() === "");
  });

  const invalidDate = fields.find((field) => {
    if (field.type !== "date") return false;

    if (!field.startDate || !field.endDate) {
      return true;
    }

    return field.startDate > field.endDate;
  });

  const invalidPattern = fields.find((field) => {
    if (field.type !== "pattern") return false;

    let hasInvalidToken = false;

    const remaining = (field.pattern ?? "")
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
  });

  if (invalidNumber) {
    return `Field "${invalidNumber.name}": Invalid number range. Check Min and Max.`;
  }

  if (invalidString) {
    return `Field "${invalidString.name}": String length must be between 1 and 100.`;
  }

  if (invalidChoice) {
    return `Field "${invalidChoice.name}": Choice must contain valid options.`;
  }

  if (invalidDate) {
    return `Field "${invalidDate.name}": Invalid date range. Check Start Date and End Date.`;
  }

  if (invalidPattern) {
    return `Field "${invalidPattern.name}": Invalid or unsupported pattern.`;
  }
  if (hasDuplicates) {
    return "Field names must be unique.";
  }

  return null;
}
