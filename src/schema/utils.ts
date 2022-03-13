import {
  isArray,
  isBoolean,
  isInteger,
  isNull,
  isNumber,
  isPlainObject,
  isString
} from "lodash";

/**
 * Hash table to determine field values are
 * the expected data type. Primarily used in Yup Lazy
 * to ensure the field value type are supported
 */

export const isTypeOfValue = {
  string: isString,
  number: isNumber,
  boolean: isBoolean,
  object: isPlainObject,
  null: isNull,
  array: isArray,
  integer: isInteger
};
