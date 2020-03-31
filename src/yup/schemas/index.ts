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
import { DataTypes, SchemaType, getPropertyType } from "../../schema/";
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
): false | SchemaType => {
  const filteredType: JSONSchema7TypeName[] = types.filter(
    item => has(validateTypeOfValue, item) && validateTypeOfValue[item](value)
  );
  if (filteredType.length) {
    const index = types.indexOf(filteredType[0]);
    return types[index];
  }
  return false;
};

/**
 * Determine which validation method to use by data type
 */

const getValidationSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.MixedSchema<any> => {
  const { type } = value;
  if (isString(type)) {
    switch (type) {
      case DataTypes.STRING:
        return createStringSchema([key, value], jsonSchema);
      case DataTypes.NUMBER:
        return createNumberSchema([key, value], jsonSchema);
      case DataTypes.INTEGER:
        return createIntegerSchema([key, value], jsonSchema);
      case DataTypes.ARRAY:
        return createArraySchema([key, value], jsonSchema);
      case DataTypes.BOOLEAN:
        return createBooleanSchema([key, value], jsonSchema);
      case DataTypes.NULL:
        return createNullSchema();
      case DataTypes.OBJECT:
        return createObjectSchema();
      default:
        throw new Error(`${type} is not supported`);
    }
  }
  throw new Error("Only string is supported");
};

/**
 * Initialises a Yup lazy instance that will determine which
 * schema to use based on the field value
 */

const getLazyValidationSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7,
  recursive: boolean = false
): Yup.Lazy =>
  Yup.lazy(inputValue => {
    const type = get(value, "type") as JSONSchema7TypeName[];
    const typeOfValue = getTypeOfValue(type, inputValue);
    if (!typeOfValue) {
      throw new Error(`${typeof inputValue} data type is not supported`);
    }
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
