import { JSONSchema7 } from "json-schema";
import get from "lodash/get";
import Yup from "../addMethods";
import {
  getConditions,
  getProperties,
  getThenCondition,
  getElseCondition,
  isSchemaObject
} from "../../schema";
import { createValidationSchema } from "./schema";
import { getObjectHead } from "../utils";
import { Builder, isBuilder } from "./types";
import isArray from "lodash/isArray";

/**
 * High order function that takes json schema and property item
 * and generates a validation schema to validate the given value
 */

const isValidator = (
  [key, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
) => (val: unknown): boolean => {
  const conditionalSchema = createValidationSchema(
    [key, value],
    jsonSchema,
    true
  );
  const result: boolean = conditionalSchema.isValidSync(val);
  return result === true;
};

/**
 * Get then schema item property with given key
 */

const getThenPropertyItem = (
  schema: JSONSchema7,
  key: string
): false | JSONSchema7 => {
  const properties = getProperties(schema);
  if (!isSchemaObject(properties)) {
    return false;
  }
  const schemaItem = get(properties, key);
  if (!isSchemaObject(schemaItem)) {
    return false;
  }
  return schemaItem;
};

/**
 * Get else schema item property with given key
 */

const getElsePropertyItem = (
  schema: JSONSchema7,
  key: string
): false | JSONSchema7 => {
  const properties = getProperties(schema);
  if (!properties) {
    return false;
  }
  const schemaItem = get(properties, key);
  if (!isSchemaObject(schemaItem)) {
    return false;
  }
  return schemaItem;
};

/**
 * Create a builder object for then schema that validates
 * the dependency
 */

const getThenPropertyBuilder = (
  [head, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7,
  key: string
): false | Builder => {
  /** Get then schema and extract out properties */
  const thenSchema = getThenCondition(jsonSchema, key);
  if (!thenSchema) {
    return false;
  }
  const thenSchemaItem = getThenPropertyItem(thenSchema, key);
  if (!thenSchemaItem) {
    return false;
  }
  /** Set up a HOF that will validate the field dependency */
  const isValid = isValidator([head, value], jsonSchema);
  /** Create a builder object for the yup when schema */
  return {
    is: isValid,
    then: createValidationSchema([key, thenSchemaItem], thenSchema, true)
  };
};

/**
 * Create a builder object for else schema that validates
 * the dependency
 */

const getElsePropertyBuilder = (
  builder: Builder,
  jsonSchema: JSONSchema7,
  key: string
): false | Builder => {
  /** Get else schema and extract out properties */
  const elseSchema = getElseCondition(jsonSchema, key);
  if (!elseSchema) {
    return false;
  }
  const elseSchemaItem =
    isSchemaObject(elseSchema) && getElsePropertyItem(elseSchema, key);
  if (!elseSchemaItem) {
    return false;
  }
  return {
    ...builder,
    otherwise: createValidationSchema([key, elseSchemaItem], elseSchema, true)
  };
};
/**
 * Initialise a yup when schema using the if,then,else sub-schema
 */

export const createConditionSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  jsonSchema: JSONSchema7,
  key: string
): T => {
  /** Get if, then, else schema. If and then schemas are
   * falsy the return the given Schema
   */

  const [_if] = getConditions(jsonSchema);
  if (!isSchemaObject(_if)) {
    return Schema;
  }
  const properties = getProperties(_if);
  if (!properties) {
    return Schema;
  }

  /** Destructure the if schema to key and value */
  const propertyItem = getObjectHead(properties);
  if (!isArray(propertyItem)) {
    return Schema;
  }
  const [head, value] = propertyItem;
  if (!isSchemaObject(value)) {
    return Schema;
  }

  let builder: Builder | {} = {};

  const thenBuilder = getThenPropertyBuilder([head, value], jsonSchema, key);
  if (!isBuilder(thenBuilder)) {
    return Schema;
  }

  builder = { ...thenBuilder };

  if (isBuilder(builder)) {
    const elseBuilder = getElsePropertyBuilder(builder, jsonSchema, key);
    if (elseBuilder) {
      builder = { ...elseBuilder };
    }
  }

  return Schema.concat(Schema.when(head, builder));
};
