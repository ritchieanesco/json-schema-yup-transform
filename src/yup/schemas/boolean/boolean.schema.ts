import { JSONSchema7 } from "json-schema";
import isBoolean from "lodash/isBoolean";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { SchemaItem } from "../../types";
import { createConditionSchema } from "../conditions";

/**
 * Initializes a yup boolean schema derived from a json boolean schema
 */

const createBooleanSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.BooleanSchema<boolean> => {
  const { default: defaults } = value;

  let Schema = Yup.boolean();

  if (isBoolean(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, key);

  Schema = createConditionSchema(Schema, jsonSchema, key);

  return Schema;
};

export default createBooleanSchema;
