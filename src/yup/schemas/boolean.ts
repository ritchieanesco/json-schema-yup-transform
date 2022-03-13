import * as Yup from "yup";
import { isBoolean } from "lodash";
import { DataTypes, SchemaKeywords } from "../../schema";
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
    title
  } = value;

  const defaultMessage =
    getErrorMessage(description, DataTypes.BOOLEAN, [key, { title }]) ||
    "This field is not of type boolean";

  let yupSchema = Yup.boolean().typeError(defaultMessage);

  yupSchema = createDefaultSchema<Yup.BooleanSchema>(yupSchema, [
    isBoolean(_default),
    _default
  ]);

  const constantErrorMessage =
    getErrorMessage(description, SchemaKeywords.CONST, [
      key,
      { const: _const?.toString(), title }
    ]);

  yupSchema = createConstantSchema<Yup.BooleanSchema>(yupSchema, [
    constantErrorMessage,
    _const
  ]);

  const requiredErrorMessage =
    getErrorMessage(description, SchemaKeywords.REQUIRED, [
      key,
      { title, required: jsonSchema.required?.join(",") }
    ]);

  yupSchema = createRequiredSchema<Yup.BooleanSchema>(yupSchema, [
    requiredErrorMessage,
    { key, required: jsonSchema.required }
  ]);

  return yupSchema;
};

export default createBooleanSchema;
