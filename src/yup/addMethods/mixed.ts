import { JSONSchema7 } from "json-schema";
import isEqual from "lodash/isEqual";
import { isValueEnum } from "./utils";
import { MixedSchema } from "yup/lib/mixed";

/**
 * Validates whether input value matches const
 */

export function constant(
  this: MixedSchema,
  value: JSONSchema7["const"],
  message: string
): MixedSchema {
  return this.test(
    "test-constant",
    message,
    function (input: JSONSchema7["const"]) {
      const { path, createError } = this;
      return isEqual(value, input) || createError({ path, message });
    }
  );
}

/**
 * Validates whetherinput value is an enum
 */

export function enums(
  this: MixedSchema,
  value: JSONSchema7["enum"],
  message: string
): MixedSchema {
  return this.test("test-enum", message, function (input) {
    const { path, createError } = this;
    return isValueEnum(value, input) || createError({ path, message });
  });
}
