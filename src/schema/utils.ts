import { JSONSchema7 } from "json-schema";
import isArray from "lodash/isArray";
import { getRequired, getEnum } from "./selectors";

/**
 * Returns a boolean if ID is a required field
 */

export const isRequiredField = (schema: JSONSchema7, id: string): boolean => {
  const requiredList = getRequired(schema);
  return isArray(requiredList) && requiredList.includes(id);
};

/**
 * Checks if value is an enum
 */

export const isEnum = (schema: JSONSchema7, txt: string | number): boolean => {
  const enums = getEnum(schema);
  return isArray(enums) && enums.includes(txt);
};
