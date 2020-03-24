import * as Yup from "yup";

/**
 * Validates a given number is a multiple of the schema multipleOf value
 */

export function multipleOf(
  this: Yup.NumberSchema,
  value: number,
  message: string
): Yup.NumberSchema {
  return this.test("test-multipleOf", message, function(input) {
    const { path, createError } = this;
    return input % value === 0 || createError({ path, message });
  });
}
