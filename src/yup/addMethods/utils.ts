import type { JSONSchema7 } from "json-schema";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import isEqual from "lodash/isEqual";
import uniq from "lodash/uniq";
import stringifyObject from "stringify-object";
import {
  DataTypes,
  isSchemaObject,
  getItemsArrayItem,
  isTypeOfValue
} from "../../schema";
import type { JSONSchema7Type } from "../types"

/**
 * Checks if input is one of enum
 */
export const isValueEnum = (enums: JSONSchema7["enum"], value: unknown): boolean =>
  isArray(enums) && enums.some((item) => isEqual(item, value));

/**
 * Validates the value from the schema items property. In addition,
 * validates const and enums for string, number and integers
 */

export const validateItemsArray = (items: JSONSchema7Type[]) => (
  item: JSONSchema7Type,
  index: number
): boolean => {
  const schemaItem = getItemsArrayItem(items, index);

  if (!isSchemaObject(schemaItem)) return false;

  const { type, enum: enums, const: consts } = schemaItem;

  // Items do not support multiple types
  if (!isString(type) || !isTypeOfValue[type](item)) return false;

  // enums and consts are only applicable to
  // types, numbers and integers
  if (
    type === DataTypes.STRING ||
    type === DataTypes.NUMBER ||
    type === DataTypes.INTEGER ||
    type === DataTypes.ARRAY
  ) {
    if (enums && !isValueEnum(enums, item)) return false;
    if ((consts || consts === null || consts === 0) && !isEqual(item, consts))
      return false;
  }

  return true;
};

/**
 * Check if each array values is unique
 */

export const isUnique = (arr: unknown[]): boolean => {
  /** Convert array values to string in order to do value comparisons*/
  const normalizedArr = arr.map((item) => {
    if (isArray(item) || isPlainObject(item))
      return stringifyObject(item).replace(/\s/g, "");
    return item;
  });
  return uniq(normalizedArr).length === normalizedArr.length;
};
