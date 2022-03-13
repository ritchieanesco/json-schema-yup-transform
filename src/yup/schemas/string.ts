import * as Yup from "yup";
import isNumber from "lodash/isNumber";
import capitalize from "lodash/capitalize";
import isString from "lodash/isString";
import isRelativeUrl from "is-relative-url";
import type { JSONSchemaExtended } from "../../schema";
import {
  INTERNATIONAL_EMAIL_REGEX,
  ISO_8601_DATE_TIME_REGEX,
  ISO_8601_TIME_REGEX,
  DATE_REGEX,
  HOSTNAME_REGEX,
  INTERNATIONAL_HOSTNAME_REGEX,
  IPV4_REGEX,
  IPV6_REGEX
} from "./constant";
import {
  createConstantSchema,
  createDefaultSchema,
  createEnumSchema,
  createRequiredSchema
} from "./util";

/**
 * Initializes a yup string schema derived from a json string schema
 */

const createStringSchema = (
  [key, value]: [string, JSONSchemaExtended],
  jsonSchema: JSONSchemaExtended
): Yup.StringSchema => {
  const { minLength, maxLength, pattern, format, regex } = value;

  const label = value.title || capitalize(key);

  let yupSchema = Yup.string().typeError(`${label} is not of type string`);

  yupSchema = createDefaultSchema<Yup.StringSchema>(yupSchema, [
    isString(value.default),
    value.default
  ]);

  yupSchema = createRequiredSchema<Yup.StringSchema>(yupSchema, [
    label,
    { key, required: jsonSchema.required }
  ]);

  yupSchema = createConstantSchema<Yup.StringSchema>(yupSchema, [
    label,
    value.const as string
  ]);

  yupSchema = createEnumSchema<Yup.StringSchema>(yupSchema, [
    label,
    value.enum
  ]);

  if (isNumber(value.minLength)) {
    yupSchema = yupSchema.concat(
      yupSchema.min(
        value.minLength,
        `${label} requires a minimum of ${minLength} characters`
      )
    );
  }

  if (isNumber(value.maxLength)) {
    yupSchema = yupSchema.concat(
      yupSchema.max(
        value.maxLength,
        `${label} cannot exceed a maximum of ${maxLength} characters`
      )
    );
  }

  if (typeof pattern !== "undefined") {
    yupSchema = yupSchema.concat(
      yupSchema.matches(new RegExp(pattern), `${label} is an incorrect format`)
    );
  }

  if (typeof regex !== "undefined") {
    yupSchema = yupSchema.concat(
      yupSchema.matches(new RegExp(regex), `${label} is an incorrect format`)
    );
  }

  if (format) {
    yupSchema = yupSchema.concat(
      createStringSchemaFormat([key, value], yupSchema)
    );
  }
  return yupSchema;
};

export const createStringSchemaFormat = (
  [key, value]: [string, JSONSchemaExtended],
  yupSchema: Yup.StringSchema
): Yup.StringSchema => {
  const { format } = value;

  const label = value.title || capitalize(key);

  if (format === "date-time")
    return yupSchema.matches(
      ISO_8601_DATE_TIME_REGEX,
      `${label} is an invalid date and time format`
    );

  if (format === "time")
    return yupSchema.matches(
      ISO_8601_TIME_REGEX,
      `${label} is an invalid time format`
    );

  if (format === "date")
    return yupSchema.matches(DATE_REGEX, `${label} is an invalid date format`);

  if (format === "email")
    return yupSchema.email(`${label} is an invalid email format`);

  if (format === "idn-email")
    return yupSchema.matches(
      INTERNATIONAL_EMAIL_REGEX,
      `${label} is an invalid international email format`
    );

  if (format === "hostname")
    return yupSchema.matches(
      HOSTNAME_REGEX,
      `${label} is an invalid hostname format`
    );

  if (format === "idn-hostname")
    return yupSchema.matches(
      INTERNATIONAL_HOSTNAME_REGEX,
      `${label} is an invalid international hostname format`
    );

  if (format === "ipv4")
    return yupSchema.matches(IPV4_REGEX, `${label} is an invalid ipv4 format`);

  if (format === "ipv6")
    return yupSchema.matches(IPV6_REGEX, `${label} is an invalid ipv6 format`);

  if (format === "uri")
    return yupSchema.url(`${label} is an invalid URI format`);

  if (format === "uri-reference") {
    return yupSchema.test({
      name: "uri-reference",
      message: `${label} is an invalid URI reference format`,
      test: (field: string | undefined): boolean => {
        if (field === undefined) return true;
        return isRelativeUrl(field);
      }
    });
  }

  if (format === "iri") {
    console.warn("iri format is not supported");
  }

  if (format === "iri-reference") {
    console.warn("iri-reference format is not supported");
  }

  return yupSchema;
};

export default createStringSchema;