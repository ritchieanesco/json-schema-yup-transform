import { JSONSchema7 } from "json-schema";
import { isRequiredField } from "../../schema";
import Yup from "../addMethods";

/**
 * Add required schema should subschema is required
 */

export const createRequiredSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  jsonSchema: JSONSchema7,
  key: string
): T => {
  if (isRequiredField(jsonSchema, key)) {
    return Schema.concat(Schema.required("This is required"));
  }
  return Schema;
};
