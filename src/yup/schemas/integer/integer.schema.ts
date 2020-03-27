import { JSONSchema7 } from "json-schema";
import Yup from "../../addMethods";
import { createBaseNumberSchema } from "../number";
import { SchemaItem } from "../../types";

/**
 * Initializes a yup integer schema derived from a json humber schema
 */

const createIntegerSchema = (
  item: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.NumberSchema<number> =>
  createBaseNumberSchema(
    Yup.number()
      .integer()
      .strict(true),
    item,
    jsonSchema
  );

export default createIntegerSchema;
