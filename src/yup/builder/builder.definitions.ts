import { JSONSchema7 } from "json-schema";
import get from "lodash/get";
import { isSchemaObject, getDefinitionItem } from "../../schema/";

/**
 * Find definition object and return object if found
 */
export const getDefinition = (
  value: JSONSchema7,
  schema: JSONSchema7
): false | JSONSchema7 => {
  const $ref = get(value, "$ref");
  if (!$ref) {
    return false;
  }
  const definition = getDefinitionItem(schema, $ref);
  if (isSchemaObject(definition)) {
    return definition;
  }
  return false;
};

/** Merge definition schema into array items schema */

export const mergeArrayItemsDefinition = (
  jsonSchema: JSONSchema7,
  value: JSONSchema7
) => {
  const { items, type } = value;
  if (type == "array" && isSchemaObject(items)) {
    /** if $ref found then retrieve the definition */
    const definition = getDefinition(items, jsonSchema);
    if (definition) {
      return { ...value, items: { ...definition } };
    }
    return false;
  }
  return false;
};
