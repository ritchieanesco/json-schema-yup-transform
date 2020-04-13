import get from "lodash/get";
import { ConfigErrors, Config, isConfigError } from "../types";

let config: Config = {};

/** Store configuration options */

export const setConfiguration = (options: Config) => {
  config = { ...options };
};

/** Retrieve configuration options */

export const getConfiguration = (): Config => config;

/** Retrieve all errors from configuration */

export const getErrors = (): ConfigErrors | undefined => config.errors;

/** Retrieve specific error from configuration */

export const getError = (path: string | false): string | false => {
  const pathArray = path && path.split(".");
  if (!pathArray) return false;
  const errors = getErrors();
  return isConfigError(errors) && get(errors, pathArray);
};
