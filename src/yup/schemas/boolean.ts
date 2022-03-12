import * as Yup from "yup";
import isBoolean from "lodash/isBoolean";
import capitalize from "lodash/capitalize";
import type { SchemaItem } from "../types";
import type { JSONSchema } from "../../schema";
import {
  createConstantSchema,
  createDefaultSchema,
  createRequiredSchema
} from "./util";

/**
 * Initializes a yup boolean schema derived from a json boolean schema
 */

const createBooleanSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.BooleanSchema => {
  const label = value.title || capitalize(key);

  let yupSchema = Yup.boolean().typeError(`${label} is not of type boolean`);

  yupSchema = createDefaultSchema<Yup.BooleanSchema>(yupSchema, [
    isBoolean(value.default),
    value.default
  ]);

  yupSchema = createConstantSchema<Yup.BooleanSchema>(yupSchema, [
    label,
    value.const as string
  ]);

  yupSchema = createRequiredSchema<Yup.BooleanSchema>(yupSchema, [
    label,
    { key, required: jsonSchema.required }
  ]);

  return yupSchema;
};

export default createBooleanSchema;
