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
