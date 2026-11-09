import type { CustomField } from "../types/generator";

export type FieldValidationError = {
  fieldIndex: number;
  target: "name" | "config";
  messageKey: string;
};

export function validateFields(
  fields: CustomField[],
): FieldValidationError | null {
  const emptyNameIndex = fields.findIndex((field) => field.name.trim() === "");

  if (emptyNameIndex !== -1) {
    return {
      fieldIndex: emptyNameIndex,
      target: "name",
      messageKey: "validation.emptyName",
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
      messageKey: "validation.invalidNumber",
    };
  }

  if (invalidString) {
    return {
      fieldIndex: fields.indexOf(invalidString),
      target: "config",
      messageKey: "validation.invalidString",
    };
  }

  if (invalidChoice) {
    return {
      fieldIndex: fields.indexOf(invalidChoice),
      target: "config",
      messageKey: "validation.invalidChoice",
    };
  }

  if (invalidDate) {
    return {
      fieldIndex: fields.indexOf(invalidDate),
      target: "config",
      messageKey: "validation.invalidDate",
    };
  }

  if (invalidPattern) {
    return {
      fieldIndex: fields.indexOf(invalidPattern),
      target: "config",
      messageKey: "validation.invalidPattern",
    };
  }

  if (hasDuplicates) {
    const duplicateIndex = names.findIndex(
      (name, index) => names.indexOf(name) !== index,
    );

    return {
      fieldIndex: duplicateIndex,
      target: "name",
      messageKey: "validation.duplicateName",
    };
  }

  return null;
}
