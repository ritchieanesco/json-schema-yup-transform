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

export const removeEmptyObjects = (el: JSONSchema7) => {
  const cleaner = (result: JSONSchema7, value: any, key: string) => {
    var isCollection = isPlainObject(value);
    var cleaned = isCollection ? cleanObject(value) : value;
    if (isCollection && isEmpty(cleaned)) {
      return;
    }
    isArray(result) ? result.push(cleaned) : (result[key] = cleaned);
  };
  const cleanObject = (el: JSONSchema7) => transform(el, cleaner);
  return isPlainObject(el) ? cleanObject(el) : el;
};

/** Replace all $ref instances with their definition */

// TODO: Update this function to use lodash transform
export const transformRefs = (schema: JSONSchema7): JSONSchema7 => {
  const replaceRefs = (item: any) => {
    for (let [key, value] of Object.entries(item)) {
      if (has(value, "$ref")) {
        const definition = getDefinitionItem(schema, get(value, "$ref"));
        if (isPlainObject(item[key])) {
          item[key] = definition;
        }
      }
      if (isPlainObject(value)) {
        replaceRefs(value);
      }
    }
    return item;
  };
  return replaceRefs(schema);
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
  const addPaths = (item: JSONSchema7, path: string = ""): JSONSchema7 => {
    for (let [key, value] of Object.entries(item)) {
      // apply the $comments property to field elements only
      if (has(value, "type") && !has(value, "properties")) {
        item[key].description = `${path}${key}`;
      }
      if (isPlainObject(value)) {
        /** capture path of the field id only */
        const id = invalidKeys.includes(key) ? "" : `${key}.`;
        addPaths(value, `${path}${id}`);
      }
    }
    return item;
  };
  return addPaths(schema);
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
