import { JSONSchema7 } from "json-schema";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import isNull from "lodash/isNull";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isInteger from "lodash/isInteger";
import { getRequired, getEnum } from "./selectors";
import { DataTypes } from "./types";
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

/**
 * Hash table to determine field values are
 * the expected data type. Primarily used in Yup Lazy
 * to ensure the field value type are supported
 */

export const isTypeOfValue = {
  [DataTypes.STRING]: isString,
  [DataTypes.NUMBER]: isNumber,
  [DataTypes.BOOLEAN]: isBoolean,
  [DataTypes.OBJECT]: isPlainObject,
  [DataTypes.NULL]: isNull,
  [DataTypes.ARRAY]: isArray,
  [DataTypes.INTEGER]: isInteger
};
