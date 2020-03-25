import * as Yup from "yup";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";
import isObject from "lodash/isObject";
import isArray from "lodash/isArray";
import isInteger from "lodash/isInteger";
import { JSONSchema7Definition } from "json-schema";
import { DataTypes } from "../../schema";
import { validateItemsArray } from "./utils";

/**
 * Validates that array length is more or equal to that
 * of the schema minimumItems property
 */

export function minimumItems(
  this: Yup.ArraySchema<unknown>,
  count: number,
  message: string
): Yup.ArraySchema<unknown> {
  return this.test("test-minimumItems", message, function(input: unknown[]) {
    const { path, createError } = this;
    let isValid = isArray(input) && input.length >= count;
    return isValid || createError({ path, message });
  });
}

/**
 * Validates that array length is less or equal to that
 * of the schema maximumItems property
 */

export function maximumItems(
  this: Yup.ArraySchema<unknown>,
  count: number,
  message: string
): Yup.ArraySchema<unknown> {
  return this.test("test-maximumItems", message, function(input: unknown[]) {
    const { path, createError } = this;
    let isValid = isArray(input) && input.length <= count;
    return isValid || createError({ path, message });
  });
}

/**
 * Validates the `contains` schema has one or more items in the array
 * equates to the data type of the schema type property
 */

export function contains(
  this: Yup.ArraySchema<unknown>,
  value: string,
  message: string
): Yup.ArraySchema<unknown> {
  return this.test("test-contains", message, function(input: unknown[]) {
    const { path, createError } = this;
    let isValid = false;
    if (isArray(input)) {
      if (value === DataTypes.NUMBER) {
        isValid = input.some(isNumber);
      }
      if (value === DataTypes.INTEGER) {
        isValid = input.some(isInteger);
      }
      if (value === DataTypes.STRING) {
        isValid = input.some(isString);
      }
      if (value === DataTypes.BOOLEAN) {
        isValid = input.some(isBoolean);
      }
      if (value === DataTypes.OBJECT) {
        isValid = input.some(isObject);
      }
      if (value === DataTypes.ARRAY) {
        isValid = input.some(isArray);
      }
    }
    return isValid || createError({ path, message });
  });
}

/**
 * Validates the items schema property as a tuple. The array is a collection
 * of items where each has a different schema and the ordinal index of
 * each item is meaningful
 */

export function tuple(
  this: Yup.ArraySchema<unknown>,
  items: JSONSchema7Definition[],
  message: string
): Yup.ArraySchema<unknown> {
  return this.test("test-tuple", message, function(input: any[]) {
    const { path, createError } = this;
    const validator = validateItemsArray(items);
    const isValid = input.every(validator);
    return isValid || createError({ path, message });
  });
}
