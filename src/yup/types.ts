
import { isPlainObject } from "lodash";
import type { JSONSchema, JSONSchemaType, NodeTypes } from "../schema"

export const isConfigError = (
  errors: undefined | ConfigErrors
): errors is ConfigErrors => isPlainObject(errors);

export type SchemaItem = [string, JSONSchema];

/* Configuration type to handle error messaging */

export type ConfigErrorTypes = {
  [key in NodeTypes]?: string | CustomErrorMsg;
};

// Custom error messaging callback

export type CustomErrorMsgParam = [ string, Record<string, JSONSchemaType | undefined> ]

export type CustomErrorMsg = (param: CustomErrorMsgParam) => string

export interface ConfigErrors {
  [key: string]: ConfigErrors | ConfigErrorTypes;
}
export interface Config {
  errors?: ConfigErrors;
}
