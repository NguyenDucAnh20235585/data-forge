import type { CustomField } from "../types/generator";

export type FieldValidationError = {
  fieldIndex: number;
  target: "name" | "config";
  message: string;
};

export function validateFields(
  fields: CustomField[],
): FieldValidationError | null {
  const emptyNameIndex = fields.findIndex((field) => field.name.trim() === "");

  if (emptyNameIndex !== -1) {
    return {
      fieldIndex: emptyNameIndex,
      target: "name",
      message: "Field name cannot be empty.",
    };
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
    return {
      fieldIndex: fields.indexOf(invalidNumber),
      target: "config",
      message: `Field "${invalidNumber.name}": Min and Max must be valid integers. Min cannot be greater than Max.`,
    };
  }

  if (invalidString) {
    return {
      fieldIndex: fields.indexOf(invalidString),
      target: "config",
      message: `Field "${invalidString.name}": String length must be between 1 and 100.`,
    };
  }

  if (invalidChoice) {
    return {
      fieldIndex: fields.indexOf(invalidChoice),
      target: "config",
      message: `Field "${invalidChoice.name}": Enter at least one non-empty option and remove any blank options.`,
    };
  }

  if (invalidDate) {
    return {
      fieldIndex: fields.indexOf(invalidDate),
      target: "config",
      message: `Field "${invalidDate.name}": Both dates are required. Start Date cannot be after End Date.`,
    };
  }

  if (invalidPattern) {
    return {
      fieldIndex: fields.indexOf(invalidPattern),
      target: "config",
      message: `Field "${invalidPattern.name}": Invalid pattern. Use tokens like {digits:6}, {letters:4}, or {choice:Red|Blue}. Lengths must be 1–100, and choices need at least 2 options.`,
    };
  }

  if (hasDuplicates) {
    const duplicateIndex = names.findIndex(
      (name, index) => names.indexOf(name) !== index,
    );

    return {
      fieldIndex: duplicateIndex,
      target: "name",
      message:
        "Field names must be unique, regardless of uppercase or lowercase.",
    };
  }

  return null;
}
