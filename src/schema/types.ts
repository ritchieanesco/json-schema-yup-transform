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
  DATE_TIME_FORMAT = "dateTime",
  DATE_FORMAT = "date",
  TIME_FORMAT = "time",
  EMAIL_FORMAT = "email",
  IDN_EMAIL_FORMAT = "idnEmail",
  HOSTNAME_FORMAT = "hostname",
  IDN_HOSTNAME_FORMAT = "idnHostname",
  IPV4_FORMAT = "ipv4",
  IPV6_FORMAT = "ipv6",
  URI_FORMAT = "uri",
  URI_REFERENCE_FORMAT = "uriReference",
  MAXIMUM_LENGTH = "maxLength",
  MINIMUM_LENGTH = "minLength",
  PATTERN = "pattern",
  MAXIMUM = "maximum",
  MINIMUM = "minimum",
  EXCLUSIVE_MINIMUM = "exclusiveMinimum",
  EXCLUSIVE_MAXIMUM = "exclusiveMaximum",
  MULTIPLE_OF = "multipleOf",
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
