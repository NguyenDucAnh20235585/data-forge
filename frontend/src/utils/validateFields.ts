import type { CustomField } from "../types/generator";

export type FieldValidationError = {
  fieldIndex: number;
  target: "name" | "config";
  messageKey: string;
};

function getPatternError(pattern?: string): string | null {
  if (!pattern?.trim()) {
    return "validation.patternRequired";
  }

  if ([...pattern].length > 200) {
    return "validation.patternTooLong";
  }

  let error: string | null = null;

  const remaining = pattern
    .replace(
      /\{(digits|letters):(\d+)\}/g,
      (_match, _kind: string, rawLength: string) => {
        const length = Number(rawLength);

        if (!Number.isSafeInteger(length) || length < 1 || length > 100) {
          error ??= "validation.patternTokenLength";
        }

        return "";
      },
    )
    .replace(/\{choice:([^{}]*)\}/g, (_match, rawOptions: string) => {
      const options = rawOptions.split("|").map((option) => option.trim());

      if (options.length < 2) {
        error ??= "validation.patternChoiceCount";
      } else if (options.some((option) => !option)) {
        error ??= "validation.patternChoiceEmpty";
      }

      return "";
    });

  if (error) return error;

  return /[{}]/.test(remaining) ? "validation.patternSyntax" : null;
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
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
    } else if ([...field.name.trim()].length > 64) {
      addError(index, "name", "validation.nameTooLong");
    } else if ((nameCounts.get(name) ?? 0) > 1) {
      addError(index, "name", "validation.duplicateName");
    }

    switch (field.type) {
      case "number": {
        const min = field.min ?? 1;
        const max = field.max ?? 100;

        if (!Number.isSafeInteger(min)) {
          addError(index, "config", "validation.numberMinInteger");
        } else if (!Number.isSafeInteger(max)) {
          addError(index, "config", "validation.numberMaxInteger");
        } else if (min > max) {
          addError(index, "config", "validation.numberInvalidRange");
        }

        break;
      }

      case "string": {
        const length = field.length ?? 8;

        if (!Number.isInteger(length)) {
          addError(index, "config", "validation.stringLengthInteger");
        } else if (length < 1 || length > 100) {
          addError(index, "config", "validation.stringLengthRange");
        }

        break;
      }

      case "choice": {
        const options = field.options ?? [];

        if (options.length === 0) {
          addError(index, "config", "validation.choiceRequired");
        } else if (options.some((option) => !option.trim())) {
          addError(index, "config", "validation.choiceEmpty");
        } else if (options.length > 20) {
          addError(index, "config", "validation.choiceTooMany");
        } else if (options.some((option) => [...option].length > 100)) {
          addError(index, "config", "validation.choiceTooLong");
        }

        break;
      }

      case "date": {
        const start = field.startDate;
        const end = field.endDate;

        if (!start || !end) {
          addError(index, "config", "validation.dateRequired");
        } else if (!isValidDate(start) || !isValidDate(end)) {
          addError(index, "config", "validation.dateInvalid");
        } else if (start > end) {
          addError(index, "config", "validation.dateInvalidRange");
        }

        break;
      }

      case "pattern": {
        const patternError = getPatternError(field.pattern);

        if (patternError) {
          addError(index, "config", patternError);
        }

        break;
      }
    }
  });

  return errors;
}

export function validateFields(
  fields: CustomField[],
): FieldValidationError | null {
  return validateAllFields(fields)[0] ?? null;
}
