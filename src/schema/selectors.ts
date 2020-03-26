import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type
} from "json-schema";
import get from "lodash/get";
import isArray from "lodash/isArray";
import nth from "lodash/nth";
import has from "lodash/has";
import findKey from "lodash/findKey";
import { DEFINITION_ROOT } from "./constants";
import { isSchemaObject } from "./types";

/**
 * Retrieve definitions property value
 */

export const getDefinitions = (
  schema: JSONSchema7
):
  | {
      [key: string]: JSONSchema7Definition;
    }
  | undefined => schema.definitions;

/**
 * Retrieve definition object from given reference id
 */

export const getDefinitionItem = (
  schema: JSONSchema7,
  ref: string
): boolean | JSONSchema7 | undefined => {
  const definitions = getDefinitions(schema);
  if (!definitions) {
    return;
  }
  const path = get$RefValue(ref);
  if (path.startsWith("#")) {
    const key = findKey(
      definitions,
      item => isSchemaObject(item) && item.$id === path
    );
    if (key) {
      return get(definitions, key);
    }
    return;
  }
  return get(definitions, path);
};

/**
 * Retrieve properties property value
 */

export const getProperties = (
  schema: JSONSchema7
):
  | {
      [key: string]: JSONSchema7Definition;
    }
  | undefined => schema.properties;

export const getPropertyType = (
  propertyItem: JSONSchema7
): JSONSchema7["type"] => propertyItem.type;

/**
 * Retrieve required property value
 */

export const getRequired = (schema: JSONSchema7): JSONSchema7["required"] =>
  schema.required;

/**
 * Return properties and required sub-schemas from the conditional objects(if)
 */

export const getConditionProperties = (
  condition: JSONSchema7,
  key: string
): false | JSONSchema7 => {
  const { properties, required } = condition;
  if (
    (isSchemaObject(properties) && has(properties, key)) ||
    (isArray(required) && required.includes(key))
  ) {
    return condition;
  }
  return false;
};

/**
 * Return the If sub-schema given a matching key
 */

export const getIfCondition = (
  schema: JSONSchema7Definition | undefined,
  key: string
): false | JSONSchema7 => {
  if (!isSchemaObject(schema)) {
    return false;
  }
  const condition = getConditions(schema);
  if (isSchemaObject(condition[0])) {
    return getConditionProperties(condition[0], key);
  }
  return false;
};

/**
 * Return the Then sub-schema given a matching key
 */

export const getThenCondition = (
  schema: JSONSchema7Definition | undefined,
  key: string
): false | JSONSchema7 => {
  if (!isSchemaObject(schema)) {
    return false;
  }
  const condition = getConditions(schema);
  if (isSchemaObject(condition[1])) {
    return getConditionProperties(condition[1], key);
  }
  return false;
};

/**
 * Return the Else sub-schema given a matching key
 */

export const getElseCondition = (
  schema: JSONSchema7Definition | undefined,
  key: string
): false | JSONSchema7 => {
  if (!isSchemaObject(schema)) {
    return false;
  }
  const condition = getConditions(schema);
  if (isSchemaObject(condition[2])) {
    return getConditionProperties(condition[2], key);
  }
  return false;
};

/**
 * Retrieve ALL conditional json sub-schema (if, then, else properties)
 */

export const getConditions = (
  schema: JSONSchema7
): (JSONSchema7Definition | undefined)[] => [
  schema.if,
  schema.then,
  schema.else
];

/**
 * Retrieve enums property value
 */

export const getEnum = (schema: JSONSchema7): JSONSchema7Type[] | undefined =>
  schema.enum;

/**
 * Retrieve const property value
 */

export const getConst = (schema: JSONSchema7): JSONSchema7["const"] =>
  schema.const;

/**
 * Retrieve reference id from `$ref` attribute
 */

const get$RefValue = (ref: string): string => {
  // support for both definition key and referencing the $id directly
  if (ref.startsWith(DEFINITION_ROOT)) {
    return ref.substring(DEFINITION_ROOT.length).replace(/\//g, ".");
  }
  return ref;
};

/**
 * Returns an item from array items tuple
 */

export const getItemsArrayItem = (
  items: JSONSchema7Definition[],
  index: number
): JSONSchema7Definition | undefined => nth(items, index);
