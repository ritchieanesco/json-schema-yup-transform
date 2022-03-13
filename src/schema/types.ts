import { has, isArray, isPlainObject } from "lodash";
import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type as UJSONSchema7Type,
  JSONSchema7TypeName as UJSONSchema7TypeName
} from "json-schema";

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
  ALLOF = "allOf",
  ANYOF = "anyOf",
  ONEOF = "oneOf",
  NOT = "not"
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

export type JSONSchema = JSONSchema7;
export type JSONSchemaDefinition = JSONSchema7Definition;
export type JSONSchemaTypeName = UJSONSchema7TypeName;
export type JSONSchemaType = UJSONSchema7Type;
export type JSONSchemaBasicType = Omit<
  JSONSchemaType,
  "JSONSchema7Object" | "JSONSchema7Array"
>;

export type NodeTypes = SchemaKeywords | CompositSchemaTypes | DataTypes;

export type JSONSchemaDefinitionExtended = JSONSchemaExtended | boolean;
export interface JSONSchemaExtended extends JSONSchema {
  regex?: string;
  properties?: {
    [key: string]: JSONSchemaDefinitionExtended;
  };
}

/**
 *  Object type guard array items key
 */

export const isSchemaObject = (
  items: JSONSchemaDefinition | JSONSchemaDefinition[] | undefined | unknown
): items is JSONSchema => isPlainObject(items);

/**
 * Tuple type guard array items key
 */

export const isItemsArray = (
  items: JSONSchemaDefinition | JSONSchemaDefinition[] | undefined
): items is JSONSchemaDefinition[] =>
  isArray(items) && items.every((item) => has(item, "type"));

export interface AnyOfSchema extends JSONSchema {
  anyOf: JSONSchemaDefinition[];
}

export interface AllOfSchema extends JSONSchema {
  allOf: JSONSchemaDefinition[];
}

export interface OneOfSchema extends JSONSchema {
  oneOf: JSONSchemaDefinition[];
}

export interface NotSchema extends JSONSchema {
  not: JSONSchemaDefinition;
}

/**
 * String pattern key type guard
 */

export const hasAnyOf = (value: JSONSchema): value is AnyOfSchema =>
  !!value.anyOf;

export const hasAllOf = (value: JSONSchema): value is AllOfSchema =>
  !!value.allOf;

export const hasOneOf = (value: JSONSchema): value is OneOfSchema =>
  !!value.oneOf;

export const hasNot = (value: JSONSchema): value is NotSchema => !!value.not;
