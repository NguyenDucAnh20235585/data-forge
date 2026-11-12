export type Preset =
  | "users"
  | "products"
  | "employees"
  | "umamusume"
  | "orders"
  | "apiLogs";

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
    | "pattern"
    | "firstName"
    | "lastName"
    | "city"
    | "country"
    | "url"
    | "ipv4"
    | "uuid"
    | "boolean";

  min?: number;
  max?: number;
  length?: number;
  options?: string[];
  startDate?: string;
  endDate?: string;
  pattern?: string;
};

export type GeneratedRecord = Record<string, string | number | boolean>;
