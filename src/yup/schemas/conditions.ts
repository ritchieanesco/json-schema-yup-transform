import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import Yup from "../addMethods";
import { getConditions, getProperties, isSchemaObject } from "../../schema";
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
  const conditionalSchema = createValidationSchema([key, value], jsonSchema);
  const result: boolean = conditionalSchema.isValidSync(val);
  return result;
};

/** Build `is` and `then` validation schema */

const buildConditionOptions = (
  condition: JSONSchema7,
  conditionItem: [string, JSONSchema7Definition],
  callback: (val: any) => boolean
): false | Builder => {
  const [conditionKey, conditionValue] = conditionItem;
  if (!isSchemaObject(conditionValue)) return false;

  /** Create a builder object for the yup when schema */
  return {
    is: callback,
    then: createValidationSchema([conditionKey, conditionValue], condition)
  };
};

/** Validate Then schema and retrieve first key value pair */

const getThenSchema = (
  schema: JSONSchema7
): false | [string, JSONSchema7Definition] => {
  const thenProperties = getProperties(schema);
  if (!thenProperties) {
    return false;
  }
  /** Destructure the if schema to key and value */
  const thenPropertyItem = getObjectHead(thenProperties);
  if (!isArray(thenPropertyItem)) {
    return false;
  }
  const [thenKey, thenValue] = thenPropertyItem;
  if (!isSchemaObject(thenValue)) {
    return false;
  }
  return [thenKey, thenValue];
};

/** Validate Else schema and retrieve first key value pair */

const getElseSchema = (
  schema: JSONSchema7
): false | [string, JSONSchema7Definition] => {
  const elseProperties = isSchemaObject(schema) && getProperties(schema);
  if (!elseProperties) {
    return false;
  }

  const elsePropertyItem = getObjectHead(elseProperties);
  if (!isArray(elsePropertyItem)) {
    return false;
  }
  const [elseKey, elseValue] = elsePropertyItem;

  if (!isSchemaObject(elseValue)) {
    return false;
  }

  return [elseKey, elseValue];
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

  const [_if, _then, _else] = getConditions(jsonSchema);
  if (!isSchemaObject(_if) || !isSchemaObject(_then)) return Schema;

  const ifProperties = getProperties(_if);
  if (!ifProperties) return Schema;

  const ifPropertyItem = getObjectHead(ifProperties);
  if (!isArray(ifPropertyItem)) return Schema;

  const [ifKey, ifValue] = ifPropertyItem;
  if (!isSchemaObject(ifValue)) return Schema;

  const thenSchema = getThenSchema(_then);
  if (!thenSchema) return Schema;

  if (key === thenSchema[0]) {
    const isValid = isValidator([ifKey, ifValue], jsonSchema);
    const thenBuilder = buildConditionOptions(
      _then,
      thenSchema,
      val => isValid(val) === true
    );
    if (isBuilder(thenBuilder)) {
      Schema = Schema.concat(Schema.when(ifKey, thenBuilder));
    }
  }

  if (!isSchemaObject(_else)) return Schema;

  const elseSchema = getElseSchema(_else);
  if (!elseSchema) return Schema;

  if (key === elseSchema[0]) {
    const isValid = isValidator([ifKey, ifValue], jsonSchema);
    /** Create a builder object for the yup when schema */
    const elseBuilder = buildConditionOptions(
      _else,
      elseSchema,
      val => isValid(val) === false
    );
    if (isBuilder(elseBuilder)) {
      Schema = Schema.concat(Schema.when(ifKey, elseBuilder));
    }
  }

  return Schema;
};
