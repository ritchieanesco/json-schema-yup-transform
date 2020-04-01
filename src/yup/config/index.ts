import get from "lodash/get";
import { ConfigErrors, Config } from "../types";

let config: Config = {};

/** Store configuration options */

export const setConfiguration = (options: Config) => {
  config = { ...options };
};

/** Retrieve configuration options */

export const getConfiguration = (): Config => config;

/** Retrieve all errors from configuration */

export const getErrors = (): ConfigErrors | false => {
  if (!config.errors) return false;
  return config.errors;
};

/** Retrieve specific error from configuration */

export const getError = (
  path: string | false,
  defaults: string = `${path} is invalid`
): string => {
  const pathArray = path && path.split(".");
  if (!pathArray) return defaults;
  const errors = getErrors();
  return get(errors, pathArray) || defaults;
};
