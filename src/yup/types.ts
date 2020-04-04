import { JSONSchema7 } from "json-schema";
import { SchemaKeywords, DataTypes } from "../schema";

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

export type JSONSchema7DefinitionExtended = JSONSchema7Extended | boolean;

export interface JSONSchema7Extended extends JSONSchema7 {
  regex?: string;
  properties?: {
    [key: string]: JSONSchema7DefinitionExtended;
  };
}
