import { JSONSchema7 } from "json-schema";
import isNumber from "lodash/isNumber";
import isUndefined from "lodash/isUndefined";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import Yup from "../../addMethods";
import {
  INTERNATIONAL_EMAIL_REGEX,
  ISO_8601_DATE_TIME_REGEX,
  ISO_8601_TIME_REGEX,
  DATE_REGEX,
  HOSTNAME_REGEX,
  INTERNATIONAL_HOSTNAME_REGEX,
  IPV4_REGEX,
  IPV6_REGEX
} from "./string.constants";
import { isPattern } from "../../../schema";
import { createRequiredSchema } from "../required";
import { SchemaItem } from "../../types";

/**
 * Initializes a yup string schema derived from a json string schema
 */

const createStringSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.StringSchema<string> => {
  const {
    default: defaults,
    minLength,
    maxLength,
    pattern,
    format,
    const: consts,
    enum: enums
  } = value;

  let Schema = Yup.string();

  if (isString(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, key);

  if (!isUndefined(consts)) {
    Schema = Schema.concat(
      Schema.constant(consts, "Value does not match constant")
    );
  }

  if (isArray(enums)) {
    Schema = Schema.concat(Schema.enum(enums, "Value does not match enum"));
  }

  if (isNumber(minLength)) {
    Schema = Schema.concat(
      Schema.min(minLength, `A minimum of ${minLength} characters required`)
    );
  }

  if (isNumber(maxLength)) {
    Schema = Schema.concat(
      Schema.max(maxLength, `A maximum of ${maxLength} characters required`)
    );
  }

  if (isPattern(pattern)) {
    Schema = Schema.concat(Schema.matches(pattern, "Incorrect format"));
  }

  if (format) {
    Schema = stringSchemaFormat(format, Schema);
  }
  return Schema;
};

export const stringSchemaFormat = (
  format: JSONSchema7["format"],
  Schema: Yup.StringSchema
) => {
  if (format === "date-time") {
    Schema = Schema.concat(
      Schema.matches(
        ISO_8601_DATE_TIME_REGEX,
        "Date and time format is invalid"
      )
    );
  }

  if (format === "time") {
    Schema = Schema.concat(
      Schema.matches(ISO_8601_TIME_REGEX, "Time format is invalid")
    );
  }

  if (format === "date") {
    Schema = Schema.concat(
      Schema.matches(DATE_REGEX, "Date format is invalid")
    );
  }

  // email

  if (format === "email") {
    Schema = Schema.concat(Schema.email("Email is invalid"));
  }

  // international email format

  if (format === "idn-email") {
    Schema = Schema.concat(
      Schema.matches(
        INTERNATIONAL_EMAIL_REGEX,
        "International email is invalid"
      )
    );
  }

  // hostnames

  if (format === "hostname") {
    Schema = Schema.concat(
      Schema.matches(HOSTNAME_REGEX, "Hostname format is invalid")
    );
  }

  if (format === "idn-hostname") {
    Schema = Schema.concat(
      Schema.matches(
        INTERNATIONAL_HOSTNAME_REGEX,
        "International hostname format is invalid"
      )
    );
  }

  // ip addresses

  if (format === "ipv4") {
    Schema = Schema.concat(
      Schema.matches(IPV4_REGEX, "ipv4 format is invalid")
    );
  }

  if (format === "ipv6") {
    Schema = Schema.concat(
      Schema.matches(IPV6_REGEX, "ipv6 format is invalid")
    );
  }

  // resource identifiers

  if (format === "uri") {
    Schema = Schema.concat(Schema.url("URI format is invalid"));
  }

  if (format === "uri-reference") {
    // `urlReference` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(
      Schema.urlReference("URI reference format is invalid")
    );
  }

  if (format === "iri") {
    console.warn("iri format is not supported");
  }

  if (format === "iri-reference") {
    console.warn("iri-reference format is not supported");
  }

  return Schema;
};

export default createStringSchema;
