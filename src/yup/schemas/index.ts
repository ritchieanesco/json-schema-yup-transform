import * as Yup from "yup";
import { get, has, isArray, isString } from "lodash";
import type { JSONSchema, JSONSchemaTypeName } from "../../schema";
import {
  DataTypes,
  getCompositionType,
  getPropertyType,
  hasAllOf,
  hasAnyOf,
  hasNot,
  hasOneOf,
  isTypeOfValue
} from "../../schema";
import type { SchemaItem } from "../types";
import createArraySchema from "./array";
import createBooleanSchema from "./boolean";
import createIntegerSchema from "./integer";
import createObjectSchema from "./object";
import createNullSchema from "./null";
import createNumberSchema from "./number";
import createStringSchema from "./string";
import {
  createAllOfSchema,
  createAnyOfSchema,
  createNotSchema,
  createOneOfSchema
} from "./composition";

/**
 * Validates the input data type against the schema type and returns
 * the current type in order to generate the schema
 */

const getTypeOfValue = (
  types: JSONSchemaTypeName[],
  value: unknown
): JSONSchemaTypeName => {
  const filteredType: JSONSchemaTypeName[] = types.filter(
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
  jsonSchema: JSONSchema
): Yup.AnyObjectSchema | Yup.BooleanSchema | Yup.ArraySchema<any> | Yup.NumberSchema | Yup.AnySchema => {

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

  if (value.type === DataTypes.NULL) {
    return createNullSchema(Yup.string())
  }

  if (value.type === DataTypes.STRING) {
    return createStringSchema([key, value], jsonSchema.required)
  }

  if (value.type === DataTypes.NUMBER) {
    return createNumberSchema([key, value], jsonSchema.required)
  }

  if (value.type === DataTypes.INTEGER) {
    return createIntegerSchema([key, value], jsonSchema.required)
  }

  if (value.type === DataTypes.ARRAY) {
    return createArraySchema([key, value], jsonSchema.required)
  }

  if (value.type === DataTypes.BOOLEAN) {
    return createBooleanSchema([key, value], jsonSchema.required)
  }

  if (value.type === DataTypes.OBJECT) {
    return createObjectSchema([key, value], jsonSchema)
  }

  throw new Error("No matching schema")

};

/**
 * Initialises a Yup lazy instance that will determine which
 * schema to use based on the field value
 */

const getLazyValidationSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
) =>
  Yup.lazy((inputValue) => {
    const type = get(value, "type") as JSONSchemaTypeName[];
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
  jsonSchema: JSONSchema
) => {
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
