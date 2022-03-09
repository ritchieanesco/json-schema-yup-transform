import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import isNull from "lodash/isNull";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isInteger from "lodash/isInteger";
import { getRequired } from "./selectors";
import type { JSONSchema } from ".";

/**
 * Returns a boolean if ID is a required field
 */

export const isRequiredField = (schema: JSONSchema, id: string): boolean => {
  const requiredList = getRequired(schema);
  return isArray(requiredList) && requiredList.includes(id);
};

/**
 * Hash table to determine field values are
 * the expected data type. Primarily used in Yup Lazy
 * to ensure the field value type are supported
 */


export const isTypeOfValue = {
  "string": isString,
  "number": isNumber,
  "boolean": isBoolean,
  "object": isPlainObject,
  "null": isNull,
  "array": isArray,
  "integer": isInteger
};
