import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import isNull from "lodash/isNull";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isInteger from "lodash/isInteger";
import get from "lodash/get";
import has from "lodash/has";
import createArraySchema from "./array";
import createBooleanSchema from "./boolean";
import createIntegerSchema from "./integer";
import createObjectSchema from "./object";
import createNullSchema from "./null";
import createNumberSchema from "./number";
import createStringSchema from "./string";
import Yup from "../addMethods/";
import { DataTypes, getPropertyType } from "../../schema/";
import { SchemaItem } from "../types";

/**
 * Hash table to determine field values are
 * the expected data type. Primarily used in Yup Lazy
 * to ensure the field value type are supported
 */

export const validateTypeOfValue = {
  [DataTypes.STRING]: isString,
  [DataTypes.NUMBER]: isNumber,
  [DataTypes.BOOLEAN]: isBoolean,
  [DataTypes.OBJECT]: isPlainObject,
  [DataTypes.NULL]: isNull,
  [DataTypes.ARRAY]: isArray,
  [DataTypes.INTEGER]: isInteger
};

/**
 * Validates the input data type against the schema type and returns
 * the current type in order to generate the schema
 */

const getTypeOfValue = (
  types: JSONSchema7TypeName[],
  value: unknown
): JSONSchema7TypeName => {
  const filteredType: JSONSchema7TypeName[] = types.filter(
    (item) => has(validateTypeOfValue, item) && validateTypeOfValue[item](value)
  );
  const index = types.indexOf(filteredType[0]);
  return types[index];
};

/**
 * Determine which validation method to use by data type
 */

const getValidationSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.MixedSchema<any> => {
  const { type } = value;
  const schemaMap = {
    [DataTypes.STRING]: createStringSchema([key, value], jsonSchema),
    [DataTypes.NUMBER]: createNumberSchema([key, value], jsonSchema),
    [DataTypes.INTEGER]: createIntegerSchema([key, value], jsonSchema),
    [DataTypes.ARRAY]: createArraySchema([key, value], jsonSchema),
    [DataTypes.BOOLEAN]: createBooleanSchema([key, value], jsonSchema),
    [DataTypes.NULL]: createNullSchema(),
    [DataTypes.OBJECT]: createObjectSchema([key, value], jsonSchema)
  };
  return schemaMap[type as JSONSchema7TypeName];
};

/**
 * Initialises a Yup lazy instance that will determine which
 * schema to use based on the field value
 */

const getLazyValidationSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.Lazy =>
  Yup.lazy((inputValue) => {
    const type = get(value, "type") as JSONSchema7TypeName[];
    const valueType = type.includes("null")
      ? inputValue === ""
        ? null
        : inputValue
      : inputValue;
    const typeOfValue = getTypeOfValue(type, valueType);
    const newItem: SchemaItem = [key, { ...value, type: typeOfValue }];
    return getValidationSchema(newItem, jsonSchema);
  });

/**
 * Generate yup validation schema from properties within
 * the valid schema
 */

const createValidationSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.Lazy | Yup.MixedSchema<any> => {
  const type = getPropertyType(value);
  if (isArray(type)) {
    return getLazyValidationSchema([key, value], jsonSchema);
  }
  if (isString(type)) {
    return getValidationSchema([key, value], jsonSchema);
  }
  throw new Error("Type key is missing");
};

export default createValidationSchema;
