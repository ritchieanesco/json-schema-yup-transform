import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import has from "lodash/has";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

export type SchemaType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "integer"
  | "array"
  | "null";

/**
 *  Object type guard array items key
 */

export const isSchemaObject = (
  items: JSONSchema7Definition | JSONSchema7Definition[] | undefined | unknown
): items is JSONSchema7 => isPlainObject(items);

/**
 * Tuple type guard array items key
 */

export const isItemsArray = (
  items: JSONSchema7Definition | JSONSchema7Definition[] | undefined
): items is JSONSchema7Definition[] =>
  isArray(items) && items.every(item => has(item, "type"));

/**
 * String pattern key type guard
 */

export const isPattern = (regexp: any): regexp is RegExp => regexp;
