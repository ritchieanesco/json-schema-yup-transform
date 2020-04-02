import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import isEqual from "lodash/isEqual";
import { isValueEnum } from "./utils";

/**
 * Validates whether input value matches const
 */

export function constant(
  this: Yup.MixedSchema,
  value: JSONSchema7["const"],
  message: string
): Yup.MixedSchema {
  return this.test("test-constant", message, function(
    input: JSONSchema7["const"]
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
  value: JSONSchema7["enum"],
  message: string
): Yup.MixedSchema {
  return this.test("test-enum", message, function(input) {
    const { path, createError } = this;
    return isValueEnum(value, input) || createError({ path, message });
  });
}
