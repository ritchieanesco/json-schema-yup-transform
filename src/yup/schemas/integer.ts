import * as Yup from "yup";
import capitalize from "lodash/capitalize";
import type { SchemaItem } from "../types";
import { createBaseNumberSchema } from "./number";
import type { JSONSchema } from "../../schema";

/**
 * Initializes a yup integer schema derived from a json humber schema
 */

const createIntegerSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.NumberSchema => {
  const label = value.title || capitalize(key);

  return createBaseNumberSchema(
    Yup.number()
      .typeError(`${label} is not of type integer`)
      .integer()
      .strict(true),
    [key, value],
    jsonSchema
  );
};

export default createIntegerSchema;
