import { findKey, get, nth } from "lodash";
import { DEFINITION_ROOT } from "./constants";
import type { JSONSchema, JSONSchemaDefinition, JSONSchemaBasicType } from "."
import { CompositSchemaTypes, isSchemaObject } from ".";

/**
 * Retrieve definitions property value
 */

export const getDefinitions = (
  schema: JSONSchema
):
  | {
      [key: string]: JSONSchemaDefinition;
    }
  | undefined => schema.definitions;

/**
 * Retrieve definition object from given reference id
 */

export const getDefinitionItem = (
  schema: JSONSchema,
  ref: string
): boolean | JSONSchema | undefined => {
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
  schema: JSONSchema
):
  | {
      [key: string]: JSONSchemaDefinition;
    }
  | undefined => schema.properties;

export const getPropertyType = (
  propertyItem: JSONSchema
): JSONSchema["type"] => propertyItem.type;

export const getCompositionType = (
  propertyItem: JSONSchema
): CompositSchemaTypes | false | undefined => (
  propertyItem.anyOf && CompositSchemaTypes.ANYOF
  || propertyItem.allOf && CompositSchemaTypes.ALLOF
  || propertyItem.oneOf && CompositSchemaTypes.ONEOF
  || propertyItem.not && CompositSchemaTypes.NOT
);

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
  items: (JSONSchemaBasicType)[],
  index: number
): JSONSchemaBasicType | undefined => nth(items, index);
