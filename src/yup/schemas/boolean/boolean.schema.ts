import type { JSONSchema7 } from "json-schema";
import isBoolean from "lodash/isBoolean";
import capitalize from "lodash/capitalize";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { createConstantSchema } from "../constant";
import { SchemaItem } from "../../types";
import { getErrorMessage } from "../../config/";
import { DataTypes } from "../../../schema";

/**
 * Initializes a yup boolean schema derived from a json boolean schema
 */

const createBooleanSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.BooleanSchema<boolean> => {
  const {
    description,
    default: defaults,
    title
  } = value;

  const label = title || capitalize(key);

  const defaultMessage = getErrorMessage(description, DataTypes.BOOLEAN, [key, { title }])
    || `${label} is not of type boolean`;

  let Schema = Yup.boolean().typeError(defaultMessage);

  if (isBoolean(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Determine if schema matches constant */
  Schema = createConstantSchema(Schema, [key, value]);

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  return Schema;
};

export default createBooleanSchema;
