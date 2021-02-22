import { JSONSchema7 } from "json-schema";
import capitalize from "lodash/capitalize";
import Yup from "../../addMethods";
import { createBaseNumberSchema } from "../number";
import { SchemaItem } from "../../types";
import { getError } from "../../config/";

/**
 * Initializes a yup integer schema derived from a json humber schema
 */

const createIntegerSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.NumberSchema<number> => {
  const { title } = value;

  const label = title || capitalize(key);

  const defaultMessage =
    getError("defaults.integer") || `${label} is not of type integer`;
  return createBaseNumberSchema(
    Yup.number().typeError(defaultMessage).integer().strict(true),
    [key, value],
    jsonSchema
  );
};

export default createIntegerSchema;
