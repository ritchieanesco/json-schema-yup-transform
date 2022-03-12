import * as Yup from "yup";
import isEqual from "lodash/isEqual";
import type { JSONSchema } from "../../schema";

export const createConstantSchema = <T extends Yup.BaseSchema>(
  schema: T,
  [message, value]: [string, string | undefined]
): T => {
  if (typeof value === "undefined") return schema;
  return schema.concat(
    schema.test({
      name: "constant",
      message,
      test: (field: unknown): boolean => isEqual(field, value)
    })
  );
};

export const createEnumSchema = <T extends Yup.BaseSchema>(
  schema: T,
  [message, value]: [string, unknown[] | undefined]
): T => {
  if (!Array.isArray(value)) return schema;
  return schema.concat(
    schema.test({
      name: "enum",
      message,
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
  [message, { required, key }]: [string, RequiredKey]
): T => {
  if (!required?.includes(key)) return schema;
  return schema.concat(schema.required(message));
};


export const createDefaultSchema = <T extends Yup.BaseSchema>(schema: T, [ predicate, value ]: [ boolean, JSONSchema["default"] ]): T => {
    return predicate ? schema.concat(schema.default(value)) : schema;
}
