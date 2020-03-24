import { JSONSchema7 } from "json-schema";
import isNumber from "lodash/isNumber";
import isUndefined from "lodash/isUndefined";
import isArray from "lodash/isArray";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { SchemaItem } from "../../types";
import { createConditionSchema } from "../conditions";

/**
 * Initializes a yup number schema derived from a json number schema
 */

const createNumberSchema = (
  item: SchemaItem,
  jsonSchema: JSONSchema7,
  recursive: boolean = false
): Yup.NumberSchema<number> =>
  createBaseNumberSchema(Yup.number(), item, jsonSchema, recursive);

/**
 * Generates a yup number schema instance that is used for both number and integer schema
 */

export const createBaseNumberSchema = (
  Schema: Yup.NumberSchema,
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7,
  recursive: boolean
): Yup.NumberSchema<number> => {
  const {
    default: defaults,
    minimum,
    maximum,
    exclusiveMaximum,
    exclusiveMinimum,
    multipleOf,
    const: consts,
    enum: enums
  } = value;

  const isMinNumber = isNumber(minimum);
  const isMaxNumber = isNumber(maximum);
  const isExclusiveMaxNumber = isNumber(exclusiveMaximum);
  const isExclusiveMinNumber = isNumber(exclusiveMinimum);

  if (isNumber(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

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
    Schema = Schema.concat(
      Schema.min(minimum as number, "Minimum value is required")
    );
  }

  if (isExclusiveMinNumber) {
    Schema = Schema.concat(
      Schema.min(
        (exclusiveMinimum as number) + 1,
        "Exclusive minimum value is required"
      )
    );
  }

  // Maximum value is inclusive
  if (isMaxNumber) {
    Schema = Schema.concat(
      Schema.max(maximum as number, "Maximum value is required")
    );
  }

  if (isExclusiveMaxNumber) {
    Schema = Schema.concat(
      Schema.max(
        (exclusiveMaximum as number) - 1,
        "Exclusive maximum value is required"
      )
    );
  }

  if (multipleOf) {
    // `multipleOf` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(
      Schema.multipleOf(
        multipleOf,
        `This value is not a multiple of ${multipleOf}`
      )
    );
  }

  if (!isUndefined(consts)) {
    Schema = Schema.concat(
      Schema.constant(consts, "Value does not match constant")
    );
  }

  if (isArray(enums)) {
    Schema = Schema.concat(Schema.enum(enums, "Value does not match enum"));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, key);

  // Recursive parameter prevents infinite loops when
  // initialised from conditional schema
  if (!recursive) {
    Schema = createConditionSchema(Schema, jsonSchema, key);
  }

  return Schema;
};

export default createNumberSchema;
