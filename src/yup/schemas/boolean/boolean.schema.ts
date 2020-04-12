import { JSONSchema7 } from "json-schema";
import isBoolean from "lodash/isBoolean";
import isUndefined from "lodash/isUndefined";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { SchemaItem } from "../../types";
import { getError } from "../../config/";
import { joinPath } from "../../utils";

/**
 * Initializes a yup boolean schema derived from a json boolean schema
 */

const createBooleanSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.BooleanSchema<boolean> => {
  const { description, default: defaults, const: consts } = value;

  const defaultMessage =
    getError("defaults.boolean") || "The value is not of type boolean";

  let Schema = Yup.boolean().typeError(defaultMessage);

  if (isBoolean(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  if (!isUndefined(consts)) {
    const path = joinPath(description, "const");
    const message = getError(path) || "Value does not match constant";
    Schema = Schema.concat(Schema.constant(consts, message));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  return Schema;
};

export default createBooleanSchema;
