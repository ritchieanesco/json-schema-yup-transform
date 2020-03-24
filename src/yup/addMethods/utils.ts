import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import isString from "lodash/isString";
import { validateTypeOfValue } from "../schemas/schema";
import { DataTypes, isSchemaObject, getItemsArrayItem } from "../../schema";
import { isEnum } from "../../schema";

/**
 * Checks if input matches constant
 */
export const isValueConstant = (
  consts: JSONSchema7["const"],
  value: any
): boolean => consts === value;

/**
 * Checks if input is one of enum
 */
export const isValueEnum = (enums: JSONSchema7["enum"], value: any): boolean =>
  isArray(enums) && enums.includes(value);

/**
 * Validates the value from the schema items property. In addition,
 * validates const and enums for string, number and integers
 */

export const validateItemsArray = (items: JSONSchema7Definition[]) => (
  item: string | number,
  index: number
): boolean => {
  const schemaItem = getItemsArrayItem(items, index);
  if (isSchemaObject(schemaItem)) {
    const { type, enum: enums, const: consts } = schemaItem;

    // Items do not support multiple types
    if (!isString(type)) {
      return false;
    }

    if (!validateTypeOfValue[type](item)) {
      return false;
    }
    // enums and consts are only applicable to
    // types, numbers and integers
    if (
      type === DataTypes.STRING ||
      type === DataTypes.NUMBER ||
      type === DataTypes.INTEGER
    ) {
      if (enums && !isEnum(schemaItem, item)) {
        return false;
      }

      if (!isUndefined(consts) && item !== consts) {
        return false;
      }
    }

    return true;
  }
  return false;
};
