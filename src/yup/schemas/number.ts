import * as Yup from "yup";
import isNumber from "lodash/isNumber";
import capitalize from "lodash/capitalize";
import type { SchemaItem } from "../types";
import type { JSONSchema } from "../../schema";
import {
  createConstantSchema,
  createDefaultSchema,
  createEnumSchema,
  createRequiredSchema
} from "./util";

/**
 * Initializes a yup number schema derived from a json number schema
 */

const createNumberSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.NumberSchema => {
  const label = value.title || capitalize(key);

  return createBaseNumberSchema(
    Yup.number().typeError(`${label} is not of type number`),
    [key, value],
    jsonSchema
  );
};
/**
 * Generates a yup number schema instance that is used for both number and integer schema
 */

export const createBaseNumberSchema = (
  yupSchema: Yup.NumberSchema,
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.NumberSchema => {
  const label = value.title || capitalize(key);

  const isMinNumber = isNumber(value.minimum);
  const isMaxNumber = isNumber(value.maximum);
  const isExclusiveMaxNumber = isNumber(value.exclusiveMaximum);
  const isExclusiveMinNumber = isNumber(value.exclusiveMinimum);

  yupSchema = createDefaultSchema<Yup.NumberSchema>(yupSchema, [ isNumber(value.default),  value.default])

  if (isExclusiveMinNumber && isMinNumber) {
    throw new Error(
      "Minimum and exclusive minimum keys can not be used together"
    );
  }

  if (isExclusiveMaxNumber && isMaxNumber) {
    throw new Error(
      "Maximum and exclusive maximum keys can not be used together"
    );
  }

  // Minimum value is inclusive
  if (isMinNumber)
    yupSchema = yupSchema.concat(
      yupSchema.min(
        value.minimum as number,
        `${label} requires a minimum value of ${value.minimum}`
      )
    );

  if (isExclusiveMinNumber) {
    yupSchema = yupSchema.concat(
      yupSchema.min(
        (value.exclusiveMinimum as number) + 1,
        `${label} requires a exclusive minimum value of ${value.exclusiveMinimum}`
      )
    );
  }

  // Maximum value is inclusive
  if (isMaxNumber) {
    yupSchema = yupSchema.concat(
      yupSchema.max(
        value.maximum as number,
        `${label} cannot exceed a maximum value of ${value.maximum}`
      )
    );
  }

  if (isExclusiveMaxNumber) {
    yupSchema = yupSchema.concat(
      yupSchema.max(
        (value.exclusiveMaximum as number) - 1,
        `${label} cannot exceed a exclusive maximum value of ${value.exclusiveMaximum}`
      )
    );
  }

  if (isNumber(value.multipleOf)) {
    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "multipleOf",
        message: `${label} requires a multiple of ${value.multipleOf}`,
        test: (field: number | undefined): boolean => {
          if (field === undefined) return true;
          return field % (value.multipleOf as number) === 0;
        }
      })
    );
  }

  yupSchema = createConstantSchema<Yup.NumberSchema>(yupSchema, [
    label,
    value.const as string
  ]);

  yupSchema = createEnumSchema<Yup.NumberSchema>(yupSchema, [
    label,
    value.enum
  ]);

  yupSchema = createRequiredSchema<Yup.NumberSchema>(yupSchema, [
    label,
    { key, required: jsonSchema.required }
  ]);

  return yupSchema;
};

export default createNumberSchema;
