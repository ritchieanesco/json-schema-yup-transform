import { JSONSchema7 } from "json-schema";
import capitalize from "lodash/capitalize";
import { isRequiredField, SchemaKeywords } from "../../schema";
import Yup from "../addMethods";
import { SchemaItem } from "../types";
import { getErrorMessage } from "../config";

/**
 * Add required schema should subschema is required
 */

export const createRequiredSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  jsonSchema: JSONSchema7,
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
