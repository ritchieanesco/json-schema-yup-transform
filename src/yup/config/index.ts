import get from "lodash/get";
import type { ConfigErrors, Config, CustomErrorMsg, CustomErrorMsgParam, NodeTypes } from "../types";
import { isConfigError } from "../types";

import { joinPath } from "../utils";

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

export const getError = (path: string | false): string | CustomErrorMsg | false => {
  const pathArray = path && path.split(".");
  if (!pathArray) return false;
  const errors = getErrors();
  return isConfigError(errors) && get(errors, pathArray);
};

/** Returns 'custom' or 'default' error message */
export const getErrorMessage = (description: string | false | undefined, type: NodeTypes, params: CustomErrorMsgParam) => {
  let customErrorMessage = description
    ? getError(joinPath(description, type))
    : undefined;

    if (typeof customErrorMessage === "undefined") customErrorMessage = getError(joinPath("defaults", type))
    if (typeof customErrorMessage === "function") return customErrorMessage(params);
    return customErrorMessage
}