import * as Yup from "yup";
import { isEqual } from "lodash";
import type { JSONSchema } from "../../schema";

type MessageOrNull = string | null;

export const createConstantSchema = <T extends Yup.BaseSchema>(
  schema: T,
  [message, value]: [MessageOrNull, JSONSchema["const"]]
): T => {
  if (typeof value === "undefined") return schema;
  return schema.concat(
    schema.test({
      name: "constant",
      message: message ?? "This field does not match constant",
      test: (field: unknown): boolean => isEqual(field, value)
    })
  );
};

export const createEnumSchema = <T extends Yup.BaseSchema>(
  schema: T,
  [message, value]: [MessageOrNull, JSONSchema["enum"]]
): T => {
  if (!Array.isArray(value)) return schema;
  return schema.concat(
    schema.test({
      name: "enum",
      message: message ?? "This field does not match any of the enumerables",
      test: (field: unknown): boolean =>
        value.some((item) => isEqual(item, field))
    })
  );
};

interface RequiredKey {
  required?: string[];
  key: string;
}

export const createRequiredSchema = <T extends Yup.BaseSchema>(
  schema: T,
  [message, { required, key }]: [MessageOrNull, RequiredKey]
): T => {
  if (!required?.includes(key)) return schema;
  return schema.concat(schema.required(message ?? "This field is required"));
};

export const createDefaultSchema = <T extends Yup.BaseSchema>(
  schema: T,
  [predicate, value]: [boolean, JSONSchema["default"]]
): T =>predicate ? schema.concat(schema.default(value)) : schema;