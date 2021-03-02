import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
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
import { DataTypes, getPropertyType, isTypeOfValue } from "../../schema/";
import { SchemaItem } from "../types";
import { MixedSchema } from "yup/lib/mixed";
import Lazy from "yup/lib/Lazy";

/**
 * Validates the input data type against the schema type and returns
 * the current type in order to generate the schema
 */

const getTypeOfValue = (
  types: JSONSchema7TypeName[],
  value: unknown
): JSONSchema7TypeName => {
  const filteredType: JSONSchema7TypeName[] = types.filter(
    (item) => has(isTypeOfValue, item) && isTypeOfValue[item](value)
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
): MixedSchema => {
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
): Lazy<any> =>
  Yup.lazy((inputValue) => {
    const type = get(value, "type") as JSONSchema7TypeName[];
    // include a check for undefined as Formik 2.1.4
    // coeerces empty strings to undefined
    const valueType = type.includes("null")
      ? inputValue === "" || inputValue === undefined
        ? null
        : inputValue
      : inputValue;
    const typeOfValue = getTypeOfValue(type, valueType) || null;
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
): Lazy<any> | MixedSchema => {
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
