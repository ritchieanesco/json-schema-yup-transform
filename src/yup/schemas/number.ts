import * as Yup from "yup";
import isNumber from "lodash/isNumber";
import capitalize from "lodash/capitalize";
import { SchemaKeywords } from "../../schema";
import type { JSONSchema } from "../../schema";
import { getErrorMessage } from "../config";
import type { SchemaItem } from "../types";
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
  const {
    const: _const,
    default: _default,
    description,
    enum: _enum,
    exclusiveMaximum,
    exclusiveMinimum,
    minimum,
    maximum,
    multipleOf,
    required,
    title
  } = value;

  const label = capitalize(key);

  const isMinNumber = isNumber(minimum);
  const isMaxNumber = isNumber(maximum);
  const isExclusiveMaxNumber = isNumber(exclusiveMaximum);
  const isExclusiveMinNumber = isNumber(exclusiveMinimum);

  yupSchema = createDefaultSchema<Yup.NumberSchema>(yupSchema, [
    isNumber(_default),
    _default
  ]);

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
  if (isMinNumber) {
    const message =
      getErrorMessage(description, SchemaKeywords.MINIMUM, [
        key,
        { title, minimum }
      ]) || `${label} requires a minimum value of ${minimum}`;

    yupSchema = yupSchema.concat(yupSchema.min(minimum as number, message));
  }

  if (isExclusiveMinNumber) {
    const message =
      getErrorMessage(description, SchemaKeywords.EXCLUSIVE_MINIMUM, [
        key,
        { title, exclusiveMinimum }
      ]) ||
      `${label} requires a exclusive minimum value of ${exclusiveMinimum}`;

    yupSchema = yupSchema.concat(
      yupSchema.min((exclusiveMinimum as number) + 1, message)
    );
  }

  // Maximum value is inclusive
  if (isMaxNumber) {
    const message =
      getErrorMessage(description, SchemaKeywords.MAXIMUM, [
        key,
        { title, maximum }
      ]) || capitalize(`${label} cannot exceed a maximum value of ${maximum}`);

    yupSchema = yupSchema.concat(yupSchema.max(maximum as number, message));
  }

  if (isExclusiveMaxNumber) {
    const message =
      getErrorMessage(description, SchemaKeywords.EXCLUSIVE_MAXIMUM, [
        key,
        { title, exclusiveMaximum }
      ]) ||
      capitalize(
        `${label} cannot exceed a exclusive maximum value of ${exclusiveMaximum}`
      );

    yupSchema = yupSchema.concat(
      yupSchema.max((exclusiveMaximum as number) - 1, message)
    );
  }

  if (isNumber(multipleOf)) {
    const message =
      getErrorMessage(description, SchemaKeywords.MULTIPLE_OF, [
        key,
        { title, multipleOf }
      ]) || capitalize(`${label} requires a multiple of ${multipleOf}`);

    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "multipleOf",
        message,
        test: (field: number | undefined): boolean => {
          if (field === undefined) return true;
          return field % (multipleOf as number) === 0;
        }
      })
    );
  }

  const constantErrorMessage =
    getErrorMessage(description, SchemaKeywords.CONST, [
      key,
      { const: _const?.toString(), title }
    ]) || `${label} does not match constant`;

  yupSchema = createConstantSchema<Yup.NumberSchema>(yupSchema, [
    constantErrorMessage,
    _const as string
  ]);

  const enumErrorMessage =
    getErrorMessage(description, SchemaKeywords.ENUM, [
      key,
      { enum: _enum?.join(","), title }
    ]) || `${label} does not match any of the enumerables`;

  yupSchema = createEnumSchema<Yup.NumberSchema>(yupSchema, [
    enumErrorMessage,
    _enum
  ]);

  const requiredErrorMessage =
    getErrorMessage(description, SchemaKeywords.REQUIRED, [
      key,
      { title, required: required?.join(",") }
    ]) || `${label} is required`;

  yupSchema = createRequiredSchema<Yup.NumberSchema>(yupSchema, [
    requiredErrorMessage,
    { key, required: jsonSchema.required }
  ]);

  return yupSchema;
};

export default createNumberSchema;
