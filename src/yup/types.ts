import { JSONSchema7 } from "json-schema";
import isPlainObject from "lodash/isPlainObject";
import { SchemaKeywords, DataTypes } from "../schema";

export const isConfigError = (
  errors: false | ConfigErrors
): errors is ConfigErrors => isPlainObject(errors);

export type SchemaItem = [string, JSONSchema7];

/* Configuration type to handle error messaging */

type NodeTypes = SchemaKeywords | DataTypes;

export type ConfigErrorTypes = {
  [key in NodeTypes]?: string;
};

export interface ConfigErrors {
  [key: string]: ConfigErrors | ConfigErrorTypes;
}
export interface Config {
  errors?: ConfigErrors;
}
