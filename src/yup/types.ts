import type { JSONSchema7, JSONSchema7Type as JSONSchema7T } from "json-schema";
import isPlainObject from "lodash/isPlainObject";
import { SchemaKeywords, DataTypes, CompositSchemaTypes } from "../schema";

export const isConfigError = (
  errors: undefined | ConfigErrors
): errors is ConfigErrors => isPlainObject(errors);

export type SchemaItem = [string, JSONSchema7];

/* Configuration type to handle error messaging */

export type NodeTypes = SchemaKeywords | CompositSchemaTypes | DataTypes;

export type ConfigErrorTypes = {
  [key in NodeTypes]?: string | CustomErrorMsg;
};

export type JSONSchema7Type = Omit<JSONSchema7T, "JSONSchema7Object"|"JSONSchema7Array">

// Custom error messaging callback

export type CustomErrorMsgParam = [ string, Record<string, JSONSchema7Type | undefined> ]

export type CustomErrorMsg = (param: CustomErrorMsgParam) => string

export interface ConfigErrors {
  [key: string]: ConfigErrors | ConfigErrorTypes;
}
export interface Config {
  errors?: ConfigErrors;
}
