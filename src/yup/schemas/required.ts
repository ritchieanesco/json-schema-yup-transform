import { JSONSchema7 } from "json-schema";
import { isRequiredField } from "../../schema";
import Yup from "../addMethods";
import { SchemaItem } from "../types";
import { getError } from "../config";
import { joinPath } from "../utils";
/**
 * Add required schema should subschema is required
 */

export const createRequiredSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  jsonSchema: JSONSchema7,
  [key, value]: SchemaItem
): T => {
  if (isRequiredField(jsonSchema, key)) {
    const { description } = value;
    const path = joinPath(description, "required");
    const message = getError(path, "This is required");
    return Schema.concat(Schema.required(message));
  }
  return Schema;
};
