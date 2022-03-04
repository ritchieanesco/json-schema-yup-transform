import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import has from "lodash/has";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";

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

/**
 * Composite schema types
 */
export enum CompositSchemaTypes {
  ALLOF = 'allOf',
  ANYOF = 'anyOf',
  ONEOF = 'oneOf',
  NOT = 'not',
}

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
  MAXIMUM_ITEMS = "maxItems",
  CONTAINS = "contains",
  TUPLE = "tuple",
  REGEX = "regex",
  UNIQUE_ITEMS = "uniqueItems"
}

export type JSONSchema7DefinitionExtended = JSONSchema7Extended | boolean;

export interface JSONSchema7Extended extends JSONSchema7 {
  regex?: string;
  properties?: {
    [key: string]: JSONSchema7DefinitionExtended;
  };
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
  isArray(items) && items.every((item) => has(item, "type"));


export interface AnyOfSchema7 extends JSONSchema7 {
  anyOf: JSONSchema7Definition[]
}

export interface AllOfSchema7 extends JSONSchema7 {
  allOf: JSONSchema7Definition[]
}

export interface OneOfSchema7 extends JSONSchema7 {
  oneOf: JSONSchema7Definition[]
}

export interface NotSchema7 extends JSONSchema7 {
  not: JSONSchema7Definition
}

/**
 * String pattern key type guard
 */

export const isRegex = (regexp: any): regexp is RegExp => regexp;

export const hasAnyOf = (value: JSONSchema7): value is AnyOfSchema7 =>
  !!value.anyOf;

export const hasAllOf = (value: JSONSchema7): value is AllOfSchema7 =>
  !!value.allOf;

export const hasOneOf = (value: JSONSchema7): value is OneOfSchema7 =>
  !!value.oneOf;

export const hasNot = (value: JSONSchema7): value is NotSchema7 =>
  !!value.not;
