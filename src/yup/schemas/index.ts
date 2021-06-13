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
import { DataTypes, getCompositionType, getPropertyType, hasAllOf, hasAnyOf, hasNot, hasOneOf, isTypeOfValue } from "../../schema/";
import { SchemaItem } from "../types";
import { createAllOfSchema, createAnyOfSchema, createNotSchema, createOneOfSchema } from "./composition";

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
): Yup.MixedSchema<any> => {
  if (hasAnyOf(value)) {
    return createAnyOfSchema([key, value], jsonSchema);
  }

  if (hasAllOf(value)) {
    return createAllOfSchema([key, value], jsonSchema);
  }

  if (hasOneOf(value)) {
    return createOneOfSchema([key, value], jsonSchema);
  }

  if (hasNot(value)) {
    return createNotSchema([key, value], jsonSchema);
  }

  const { type } = value;

  const schemaMap = {
    [DataTypes.STRING]: createStringSchema,
    [DataTypes.NUMBER]: createNumberSchema,
    [DataTypes.INTEGER]: createIntegerSchema,
    [DataTypes.ARRAY]: createArraySchema,
    [DataTypes.BOOLEAN]: createBooleanSchema,
    [DataTypes.NULL]: createNullSchema,
    [DataTypes.OBJECT]: createObjectSchema,
  };

  return schemaMap[type as JSONSchema7TypeName]([key, value], jsonSchema);
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
): Yup.Lazy | Yup.MixedSchema<any> => {
  const type = getPropertyType(value) || getCompositionType(value);
  if (isArray(type)) {
    return getLazyValidationSchema([key, value], jsonSchema);
  }
  if (isString(type)) {
    return getValidationSchema([key, value], jsonSchema);
  }
  throw new Error("Type key is missing");
};

export default createValidationSchema;
