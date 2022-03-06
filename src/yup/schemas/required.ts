import capitalize from "lodash/capitalize";
import type { JSONSchema } from "../../schema";
import { isRequiredField, SchemaKeywords } from "../../schema";
import Yup from "../addMethods";
import type { SchemaItem } from "../types";
import { getErrorMessage } from "../config";

/**
 * Add required schema should subschema is required
 */

export const createRequiredSchema = <T extends Yup.Schema<unknown>>(
  Schema: T,
  jsonSchema: JSONSchema,
  [key, value]: SchemaItem
): T => {
  if (!isRequiredField(jsonSchema, key)) return Schema;

  const { description, title } = value;
  const label = title || capitalize(key);
  const required = jsonSchema.type === "object" ? jsonSchema.required : value.required
  const message = getErrorMessage(description, SchemaKeywords.REQUIRED, [ key, { title, required: required?.join(",") } ])
    || `${label} is required`;

  return Schema.concat(Schema.required(message));
};
