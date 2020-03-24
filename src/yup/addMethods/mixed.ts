import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import { isValueConstant, isValueEnum } from "./utils";

/**
 * Validates whether input value matches const
 */

export function Constant(
  this: Yup.MixedSchema,
  value: JSONSchema7["const"],
  message: string
): Yup.MixedSchema {
  return this.test("test-constant", message, function(
    input: JSONSchema7["const"]
  ) {
    const { path, createError } = this;
    return isValueConstant(value, input) || createError({ path, message });
  });
}

/**
 * Validates whetherinput value is an enum
 */

export function Enum(
  this: Yup.MixedSchema,
  value: JSONSchema7["enum"],
  message: string
): Yup.MixedSchema {
  return this.test("test-enum", message, function(input) {
    const { path, createError } = this;
    return isValueEnum(value, input) || createError({ path, message });
  });
}
