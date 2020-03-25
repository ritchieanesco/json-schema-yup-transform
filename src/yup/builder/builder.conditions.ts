import { JSONSchema7 } from "json-schema";
import isUndefined from "lodash/isUndefined";
import get from "lodash/get";
import has from "lodash/has";
import isArray from "lodash/isArray";
import { getProperties, isSchemaObject, getConditions } from "../../schema/";
import { getObjectHead } from "../utils";
import { getDefinition } from "./builder.definitions";

/** Take the current condition properties and update with new type property */

const updateConditionProperties = (
  conditionProperties: JSONSchema7["properties"],
  schemaPropertyType: JSONSchema7["type"],
  [key, value]: [string, JSONSchema7]
): JSONSchema7["properties"] => {
  // should condition properties not have type attribute
  // retrieve from schema properties
  if (schemaPropertyType) {
    return {
      ...conditionProperties,
      [key]: {
        ...value,
        type: schemaPropertyType
      }
    };
  }
  // if no type attribute found in schema properties and
  // condition properties throw error
  throw new Error("Type attribute is missing");
};

/**
 * Adds properties from then and else properties to the schema properties object
 * should they not exist. Only the type attribute is added to determine the yup schema.
 * If from then and else properties are missing add type attribute to them
 * from the schema properties
 */

const updateThenElseProperties = (
  jsonSchema: JSONSchema7,
  conditionSchema: JSONSchema7
): {
  properties: JSONSchema7["properties"];
  conditions: JSONSchema7;
} => {
  const schemaProperties = getProperties(jsonSchema);
  const conditionProperties = getProperties(conditionSchema);
  let newProperties: JSONSchema7["properties"] = {};
  let newConditionProperties: JSONSchema7["properties"] = {};
  if (isSchemaObject(schemaProperties) && isSchemaObject(conditionProperties)) {
    /** Grab the first item */
    const conditionPropertyItem = getObjectHead(conditionProperties);
    if (!isArray(conditionPropertyItem)) {
      return {
        properties: { ...schemaProperties },
        conditions: { ...conditionSchema }
      };
    }
    const [key, value] = conditionPropertyItem;
    if (!isSchemaObject(value)) {
      return {
        properties: { ...schemaProperties },
        conditions: { ...conditionSchema }
      };
    }
    const schemaPropertyItem = get(schemaProperties, key);
    const { type, items } = value;

    //TODO: Break all these conditions into own functions

    if (isSchemaObject(items)) {
      const definition = getDefinition(items, jsonSchema);
      if (isSchemaObject(definition)) {
        newConditionProperties = {
          ...newConditionProperties,
          [key]: {
            ...value,
            items: {
              ...definition
            }
          }
        };
      }
    }

    const definition = getDefinition(value, jsonSchema);
    if (isSchemaObject(definition)) {
      newConditionProperties = {
        ...newConditionProperties,
        [key]: {
          ...definition
        }
      };
    } else {
      if (isSchemaObject(schemaPropertyItem)) {
        if (isUndefined(type)) {
          const schemaPropertyType = get(schemaPropertyItem, "type");
          newConditionProperties = updateConditionProperties(
            newConditionProperties,
            schemaPropertyType,
            [key, value]
          );
        }
      } else {
        // if key does not exist in schema properties then generate one
        // using the condition property
        newProperties = {
          ...newProperties,
          [key]: {
            type,
            $comment: "dynamic"
          }
        };
      }
    }
  }

  return {
    properties: { ...schemaProperties, ...newProperties },
    conditions: {
      ...conditionSchema,
      properties: {
        ...conditionProperties,
        ...newConditionProperties
      }
    }
  };
};

/**
 * JSON Schema does not enforce `type` attribute to be available on all schemas
 * This utility requires a type property to determine the matching yup schema.
 * This function updates If schema with type property if it is missing.
 */

const updateIfCondition = (
  jsonSchema: JSONSchema7,
  condition: JSONSchema7
): JSONSchema7 => {
  const schemaProperties = getProperties(jsonSchema);
  const conditionProperties = getProperties(condition);
  let newConditionProperties = {};
  if (isSchemaObject(schemaProperties) && isSchemaObject(conditionProperties)) {
    const conditionPropertyItem = getObjectHead(conditionProperties);
    if (!isArray(conditionPropertyItem)) {
      return condition;
    }
    const [key, value] = conditionPropertyItem;
    const props = isSchemaObject(value) && get(schemaProperties, key);
    if (isSchemaObject(props) && !has(value, "type")) {
      newConditionProperties = {
        ...newConditionProperties,
        [key]: {
          ...value,
          type: get(props, "type")
        }
      };
    }
    if (!isSchemaObject(props) && !has(value, "type")) {
      throw new Error(
        "Unable to find the schema property related to the if schema"
      );
    }
  }
  return {
    ...condition,
    properties: { ...conditionProperties, ...newConditionProperties }
  };
};

/**
 * Update schema conditions(if, then, else) and properties with any required
 * or missing information
 */

export const mergeConditions = (jsonSchema: JSONSchema7): JSONSchema7 => {
  /** get then, else properties and determine are they dynamic or exist in properties */
  const [_if, _then, _else] = getConditions(jsonSchema);
  if (isSchemaObject(_if)) {
    const ifSchema = updateIfCondition(jsonSchema, _if);
    jsonSchema = { ...jsonSchema, if: { ...ifSchema } };
  }

  if (isSchemaObject(_then)) {
    const { properties, conditions } = updateThenElseProperties(
      jsonSchema,
      _then
    );
    jsonSchema = {
      ...jsonSchema,
      properties: { ...properties },
      then: { ...conditions }
    };
  }

  if (isSchemaObject(_else)) {
    const { properties, conditions } = updateThenElseProperties(
      jsonSchema,
      _else
    );
    jsonSchema = {
      ...jsonSchema,
      properties: { ...properties },
      else: { ...conditions }
    };
  }
  return jsonSchema;
};
