import get from "lodash/get";
import head from "lodash/head";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import transform from "lodash/transform";
import flow from "lodash/flow";
import { JSONSchema7 } from "json-schema";
import has from "lodash/has";
import { getDefinitionItem } from "../schema/";

/**
 * Concatenates the schema field path and schema key in order to retrieve error message
 * from configuration
 */

export const joinPath = (
  description: string | undefined,
  schemaKey: string
): string | false => (description ? `${description}.${schemaKey}` : false);

/** Retrieves the first item in an object */

export const getObjectHead = <T>(obj: T): false | [string, T[keyof T]] => {
  /** Get all keys from obj */
  const arr = Object.keys(obj);
  /** Grab the first key */
  const key = head(arr);
  if (!isString(key)) {
    return false;
  }
  /** Grab the first item */
  const value = get(obj, key);
  return [key, value];
};

/** Recursively removes any empty objects */

export const removeEmptyObjects = (schema: JSONSchema7) => {
  const cleaner = (result: JSONSchema7, value: any, key: string) => {
    const isCollection = isPlainObject(value);
    const cleaned = isCollection ? cleanObject(value) : value;
    if (isCollection && isEmpty(cleaned)) {
      return;
    }
    isArray(result) ? result.push(cleaned) : (result[key] = cleaned);
  };
  const cleanObject = (schema: JSONSchema7) => transform(schema, cleaner);
  return isPlainObject(schema) ? cleanObject(schema) : schema;
};

/** Replace all $ref instances with their definition */

export const transformRefs = (schema: JSONSchema7): JSONSchema7 => {
  const replaceRefs = (result: JSONSchema7, value: any, key: string) => {
    const hasRef = get(value, "$ref");
    const replaced = hasRef
      ? getDefinitionItem(schema, get(value, "$ref"))
      : isPlainObject(value)
      ? replaceAllRefs(value)
      : value;
    result[key] = replaced;
  };
  const replaceAllRefs = (schema: JSONSchema7): JSONSchema7 =>
    transform(schema, replaceRefs);
  return isPlainObject(schema) ? replaceAllRefs(schema) : schema;
};

/**
 * Add type property to all if schema's using the id of that schema
 * to lookup the type in the properties schema
 * */

// TODO: Update this function to use lodash transform
export const applyIfTypes = (schema: JSONSchema7): JSONSchema7 => {
  const addTypes = (item: any) => {
    for (let [key, value] of Object.entries(item)) {
      if (key === "if") {
        const properties = get(value, "properties");
        if (!properties) continue;
        const ifSchema = getObjectHead(properties);
        if (!ifSchema) continue;
        const ifSchemaKey = ifSchema[0];
        if (!has(properties[ifSchemaKey], "type")) {
          /** Get related schema properties type */
          const type = get(item.properties[ifSchemaKey], "type");
          if (!type) continue;
          item.if = {
            ...item.if,
            properties: {
              ...item.if.properties,
              [ifSchemaKey]: {
                ...item.if.properties[ifSchemaKey],
                type
              }
            }
          };
        }
      }
      if (isPlainObject(value)) {
        addTypes(value);
      }
    }
    return item;
  };
  return addTypes(schema);
};

/**
 * Iterate through schema and adds description property with the associated node path
 * This will remove any existing description values!
 */

export const applyPaths = (schema: JSONSchema7): JSONSchema7 => {
  const invalidKeys = [
    "properties",
    "then",
    "if",
    "definitions",
    "else",
    "items"
  ];
  const addPath = (schema: JSONSchema7, path: string = ""): JSONSchema7 =>
    transform(schema, (result: JSONSchema7, value: any, key: string) => {
      /** Target field node only */
      const isField = has(value, "type") && !has(value, "properties");
      if (isField) {
        value = {
          ...value,
          description: `${path}${key}`
        };
      }
      /** Capture path of the field id only */
      const id = invalidKeys.includes(key) ? "" : `${key}.`;
      result[key] = isPlainObject(value)
        ? addPath(value, `${path}${id}`)
        : value;
    });
  return isPlainObject(schema) ? addPath(schema) : schema;
};

/**
 * Normalizes schema to the required shape. Removes empty objects,
 * replaces $ref values with the related definition and adds
 * missing type properties to if schemas
 */

export const normalize = (schema: JSONSchema7): JSONSchema7 => {
  const normalizer = flow([
    removeEmptyObjects,
    transformRefs,
    applyPaths, // this needs to be before if injection or it will apply the path there
    applyIfTypes
  ]);
  return normalizer(schema);
};
