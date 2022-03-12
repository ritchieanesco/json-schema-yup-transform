import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import isNull from "lodash/isNull";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isInteger from "lodash/isInteger";

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
