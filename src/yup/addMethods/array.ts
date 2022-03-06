import * as Yup from "yup";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";
import isPlainObject from "lodash/isPlainObject";
import isArray from "lodash/isArray";
import isInteger from "lodash/isInteger";
import type { JSONSchemaDefinitionExtended } from "../../schema";
import { DataTypes } from "../../schema";
import { validateItemsArray, isUnique } from "./utils";

/**
 * Validates that array length is more or equal to that
 * of the schema minimumItems property
 */

export function minimumItems(
  this: Yup.ArraySchema<unknown>,
  count: number,
  message: string
): Yup.ArraySchema<unknown> {
  return this.test("test-minimumItems", message, function (input: unknown[]) {
    const { path, createError } = this;
    if (input === undefined) return true;
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
  return this.test("test-maximumItems", message, function (input: unknown[]) {
    const { path, createError } = this;
    if (input === undefined) return true;
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
  return this.test("test-contains", message, function (input: unknown[]) {
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
        isValid = input.some(isPlainObject);
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
  items: JSONSchemaDefinitionExtended[],
  message: string
): Yup.ArraySchema<unknown> {
  return this.test("test-tuple", message, function (input: JSONSchemaDefinitionExtended[]) {
    const { path, createError } = this;
    const validator = validateItemsArray(items);
    const isValid = input.every(validator);
    return isValid || createError({ path, message });
  });
}

/**
 * Validates the given array values are unique
 */

export function uniqueItems(
  this: Yup.ArraySchema<unknown>,
  enable: boolean,
  message: string
): Yup.ArraySchema<unknown> {
  return this.test("test-unique-items", message, function (input: unknown[]) {
    const { path, createError } = this;
    // method will always be valid if uniqueItems property is set to false
    if (!enable) return true;
    if (!isArray(input)) return false;
    // empty arrays are always considered valid
    if (input.length === 0) return true;
    return isUnique(input) || createError({ path, message });
  });
}
