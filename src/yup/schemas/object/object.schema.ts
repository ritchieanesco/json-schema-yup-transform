import { JSONSchema7 } from "json-schema";
import capitalize from "lodash/capitalize";
import { SchemaItem } from "../../types";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { getError } from "../../config/";

/**
 * Initializes a yup object schema derived from a json object schema
 */

const createObjectSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.ObjectSchema<object> => {
  const defaultMessage =
    getError("defaults.object") || capitalize(`${key} is not of type object`);

  let Schema = Yup.object().typeError(defaultMessage);

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  return Schema;
};

export default createObjectSchema;
