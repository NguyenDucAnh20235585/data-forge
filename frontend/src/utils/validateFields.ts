import type { CustomField } from "../types/generator";

export function validateFields(fields: CustomField[]): string | null {
  const hasEmptyName = fields.some((field) => field.name.trim() === "");

  if (hasEmptyName) {
    return "Field name cannot be empty.";
  }

  const names = fields.map((field) => field.name.trim().toLowerCase());

  const hasDuplicates = new Set(names).size !== names.length;

  const hasInvalidRange = fields.some((field) => {
    if (field.type !== "number") return false;

    const min = field.min ?? 1;
    const max = field.max ?? 100;

    return (
      !Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max
    );
  });

  const hasInvalidLength = fields.some((field) => {
    if (field.type !== "string") return false;

    const length = field.length ?? 8;

    return !Number.isInteger(length) || length < 1 || length > 100;
  });

  const hasInvalidOptions = fields.some((field) => {
    if (field.type !== "choice") return false;

    if (!field.options || field.options.length === 0) {
      return true;
    }

    return field.options.some((option) => option.trim() === "");
  });

  const hasInvalidDateRange = fields.some((field) => {
    if (field.type !== "date") return false;

    if (!field.startDate || !field.endDate) {
      return true;
    }

    return field.startDate > field.endDate;
  });

  if (hasInvalidDateRange) {
    return "Invalid date range. Check Start Date and End Date.";
  }

  if (hasInvalidRange) {
    return "Invalid number range. Check Min and Max.";
  }

  if (hasInvalidLength) {
    return "String length must be between 1 and 100.";
  }

  if (hasInvalidOptions) {
    return "Choice must contain valid options.";
  }

  if (hasDuplicates) {
    return "Field names must be unique.";
  }

  return null;
}
