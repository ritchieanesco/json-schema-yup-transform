import { JSONSchema7 } from "json-schema";
import Yup from "../../addMethods";
import { createBaseNumberSchema } from "../number";
import { SchemaItem } from "../../types";
import { getError } from "../../config/";

/**
 * Initializes a yup integer schema derived from a json humber schema
 */

const createIntegerSchema = (
  item: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.NumberSchema<number> => {
  const defaultMessage =
    getError("defaults.integer") || "The value is not of type integer";
  return createBaseNumberSchema(
    Yup.number().typeError(defaultMessage).integer().strict(true),
    item,
    jsonSchema
  );
};

export default createIntegerSchema;
