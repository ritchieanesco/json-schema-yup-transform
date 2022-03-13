import * as Yup from "yup";
import isBoolean from "lodash/isBoolean";
import capitalize from "lodash/capitalize";
import { SchemaKeywords } from "../../schema";
import type { JSONSchema } from "../../schema";
import { getErrorMessage } from "../config";
import type { SchemaItem } from "../types";

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
  const {
    const: _const,
    default: _default,
    description,
    required,
    title
  } = value;
  const label = capitalize(key);

  let yupSchema = Yup.boolean().typeError(`${label} is not of type boolean`);

  yupSchema = createDefaultSchema<Yup.BooleanSchema>(yupSchema, [
    isBoolean(_default),
    _default
  ]);

  const constantErrorMessage =
    getErrorMessage(description, SchemaKeywords.CONST, [
      key,
      { const: _const?.toString(), title }
    ]) || `${label} does not match constant`;

  yupSchema = createConstantSchema<Yup.BooleanSchema>(yupSchema, [
    constantErrorMessage,
    _const as string
  ]);

  const requiredErrorMessage =
    getErrorMessage(description, SchemaKeywords.REQUIRED, [
      key,
      { title, required: required?.join(",") }
    ]) || `${label} is required`;

  yupSchema = createRequiredSchema<Yup.BooleanSchema>(yupSchema, [
    requiredErrorMessage,
    { key, required: jsonSchema.required }
  ]);

  return yupSchema;
};

export default createBooleanSchema;
