export type Preset = "users" | "products" | "employees" | "umamusume";

export type CustomField = {
  name: string;
  type:
    | "personName"
    | "productName"
    | "companyName"
    | "number"
    | "email"
    | "string"
    | "choice"
    | "phoneNumber"
    | "date"
    | "pattern";

  min?: number;
  max?: number;
  length?: number;
  options?: string[];
  startDate?: string;
  endDate?: string;
  pattern?: string;
};

export type GeneratedRecord = Record<string, string | number>;
