import type { JSONSchema7, JSONSchema7Type } from "json-schema";
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

// Custom error messaging callback

export type CustomErrorMsgParam = [ string, Record<string, Omit<JSONSchema7Type, "JSONSchema7Object"|"JSONSchema7Array"> | undefined> ]

export type CustomErrorMsg = (param: CustomErrorMsgParam) => string

export interface ConfigErrors {
  [key: string]: ConfigErrors | ConfigErrorTypes;
}
export interface Config {
  errors?: ConfigErrors;
}
