import * as Yup from "yup";
import isEqual from "lodash/isEqual";
import type { JSONSchema } from "../../schema";
import { isValueEnum } from "./utils";

/**
 * Validates whether input value matches const
 */

export function constant(
  this: Yup.MixedSchema,
  value: JSONSchema["const"],
  message: string
): Yup.MixedSchema {
  return this.test("test-constant", message, function(
    input: JSONSchema["const"]
  ) {
    const { path, createError } = this;
    return isEqual(value, input) || createError({ path, message });
  });
}

/**
 * Validates whetherinput value is an enum
 */

export function enums(
  this: Yup.MixedSchema,
  value: JSONSchema["enum"],
  message: string
): Yup.MixedSchema {
  return this.test("test-enum", message, function(input: JSONSchema["enum"]) {
    const { path, createError } = this;
    return isValueEnum(value, input) || createError({ path, message });
  });
}
