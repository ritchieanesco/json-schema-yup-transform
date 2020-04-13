import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import get from "lodash/get";
import nth from "lodash/nth";
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
      (item) => isSchemaObject(item) && item.$id === path
    );
    return key ? get(definitions, key) : undefined;
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
): boolean | JSONSchema7 | undefined => nth(items, index);
