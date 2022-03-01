import { JSONSchema7 } from "json-schema";
import isPlainObject from "lodash/isPlainObject";
import { SchemaKeywords, DataTypes, CompositSchemaTypes } from "../schema";

export const isConfigError = (
  errors: undefined | ConfigErrors
): errors is ConfigErrors => isPlainObject(errors);

export type SchemaItem = [string, JSONSchema7];

/* Configuration type to handle error messaging */

export type NodeTypes = SchemaKeywords | CompositSchemaTypes | DataTypes;

export type ConfigErrorTypes = {
  [key in NodeTypes]?: string;
};

// Custom error messaging callback

export type CustomErrorMsgParam = [ string, Record<string, string | number | undefined> ]

export type CustomErrorMsg = (param?: CustomErrorMsgParam) => string

export interface ConfigErrors {
  [key: string]: ConfigErrors | ConfigErrorTypes | CustomErrorMsg;
}
export interface Config {
  errors?: ConfigErrors;
}
