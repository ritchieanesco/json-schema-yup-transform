import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import has from "lodash/has";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";

/**
 * Schema Types
 */

export enum DataTypes {
  STRING = "string",
  NUMBER = "number",
  ARRAY = "array",
  BOOLEAN = "boolean",
  OBJECT = "object",
  NULL = "null",
  INTEGER = "integer"
}

export type SchemaType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "integer"
  | "array"
  | "null";

export enum SchemaKeywords {
  REQUIRED = "required",
  ENUM = "enum",
  CONST = "const",
  FORMAT = "format",
  MAXIMUM_LENGTH = "maxLength",
  MINIMUM_LENGTH = "minimumLength",
  PATTERN = "pattern",
  MAXIMUM = "maximum",
  MINIMUM = "minimum",
  MINIMUM_ITEMS = "minItems",
  MAXIMUM_ITEMS = "maxItems"
}

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
