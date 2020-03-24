import * as Yup from "yup";
import isRelativeUrl from "is-relative-url";

/**
 * Validates that url format is of a relative url
 */

export function urlReference(
  this: Yup.StringSchema,
  message: string
): Yup.StringSchema {
  return this.test("test-urlReference", message, function(input) {
    const { path, createError } = this;
    return isRelativeUrl(input) || createError({ path, message });
  });
}
