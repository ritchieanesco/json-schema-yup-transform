import { JSONSchema7 } from "json-schema";
//import get from "lodash/get";
import Yup from "../addMethods";
import {
  getConditions,
  getProperties,
  //getThenCondition,
  //getElseCondition,
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
  const conditionalSchema = createValidationSchema([key, value], jsonSchema);
  const result: boolean = conditionalSchema.isValidSync(val);
  return result;
};

const getThenPropertyBuilder = (
  [head, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
): false | Builder => {
  /** Get then schema and extract out properties */
  const conditions = getConditions(jsonSchema);
  if (!conditions) return false;
  if (!isSchemaObject(conditions[1])) return false;

  const { properties } = conditions[1];
  if (!properties) return false;

  const thenItem = getObjectHead(properties);
  if (!thenItem) return false;

  const [k, v] = thenItem;
  if (!isSchemaObject(v)) return false;

  // /** Set up a HOF that will validate the field dependency */
  const isValid = isValidator([head, value], jsonSchema);

  /** Create a builder object for the yup when schema */
  return {
    is: val => {
      return isValid(val) === true;
    },
    then: createValidationSchema([k, v], conditions[1])
  };
};

const getElsePropertyBuilder = (
  [head, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
): false | Builder => {
  const conditions = getConditions(jsonSchema);
  if (!conditions) return false;
  if (!isSchemaObject(conditions[2])) return false;

  const { properties } = conditions[2];
  if (!properties) return false;

  const elseItem = getObjectHead(properties);
  if (!elseItem) return false;

  const [k, v] = elseItem;
  if (!isSchemaObject(v)) return false;
  console.log("else", k, v);

  const isValid = isValidator([head, value], jsonSchema);

  /** Create a builder object for the yup when schema */
  return {
    is: val => {
      return isValid(val) === false;
    },
    then: createValidationSchema([k, v], conditions[2])
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

  const [_if, _then, _else] = getConditions(jsonSchema);

  if (!isSchemaObject(_if) || !isSchemaObject(_then)) {
    return Schema;
  }

  const ifProperties = getProperties(_if);
  if (!ifProperties) {
    return Schema;
  }

  /** Destructure the if schema to key and value */
  const ifPropertyItem = getObjectHead(ifProperties);
  if (!isArray(ifPropertyItem)) {
    return Schema;
  }
  const [ifKey, ifValue] = ifPropertyItem;
  if (!isSchemaObject(ifValue)) {
    return Schema;
  }

  const thenProperties = getProperties(_then);
  if (!thenProperties) {
    return Schema;
  }

  /** Destructure the if schema to key and value */
  const thenPropertyItem = getObjectHead(thenProperties);
  if (!isArray(thenPropertyItem)) {
    return Schema;
  }
  const [thenKey, thenValue] = thenPropertyItem;
  if (!isSchemaObject(thenValue)) {
    return Schema;
  }

  if (key === thenKey) {
    const thenBuilder = getThenPropertyBuilder([ifKey, ifValue], jsonSchema);
    if (isBuilder(thenBuilder)) {
      Schema = Schema.concat(Schema.when(ifKey, thenBuilder));
    }
  }

  const elseProperties = isSchemaObject(_else) && getProperties(_else);
  if (!elseProperties) {
    return Schema;
  }

  /** Destructure the if schema to key and value */
  const elsePropertyItem = getObjectHead(elseProperties);
  if (!isArray(elsePropertyItem)) {
    return Schema;
  }
  const [elseKey, elseValue] = elsePropertyItem;

  if (!isSchemaObject(elseValue)) {
    return Schema;
  }

  if (key === elseKey) {
    const elseBuilder = getElsePropertyBuilder([ifKey, ifValue], jsonSchema);
    if (isBuilder(elseBuilder)) {
      console.log("sfsd", key);
      Schema = Schema.concat(Schema.when(ifKey, elseBuilder));
    }
  }

  return Schema;
};
