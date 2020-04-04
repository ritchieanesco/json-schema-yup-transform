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
import { isRegex, JSONSchema7Extended } from "../../../schema";
import { createRequiredSchema } from "../required";
import { getError } from "../../config/";
import { joinPath } from "../../utils";

/**
 * Initializes a yup string schema derived from a json string schema
 */

const createStringSchema = (
  [key, value]: [string, JSONSchema7Extended],
  jsonSchema: JSONSchema7Extended
): Yup.StringSchema<string> => {
  const {
    description,
    default: defaults,
    minLength,
    maxLength,
    pattern,
    format,
    const: consts,
    enum: enums,
    regex
  } = value;

  const defaultMessage = getError(
    "defaults.string",
    "The value is not of type string"
  );

  let Schema = Yup.string().typeError(defaultMessage);

  if (isString(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  if (!isUndefined(consts)) {
    const path = joinPath(description, "const");
    const message = getError(path, `Value does not match constant`);

    Schema = Schema.concat(Schema.constant(consts, message));
  }

  if (isArray(enums)) {
    const path = joinPath(description, "enum");
    const message = getError(path, `Value does not match enum`);
    Schema = Schema.concat(Schema.enum(enums, message));
  }

  if (isNumber(minLength)) {
    const path = joinPath(description, "minLength");
    const message = getError(
      path,
      `A minimum of ${minLength} characters required`
    );
    Schema = Schema.concat(Schema.min(minLength, message));
  }

  if (isNumber(maxLength)) {
    const path = joinPath(description, "maxLength");
    const message = getError(
      path,
      `A maximum of ${maxLength} characters required`
    );
    Schema = Schema.concat(Schema.max(maxLength, message));
  }

  if (isRegex(pattern)) {
    const path = joinPath(description, "pattern");
    const message = getError(path, "Incorrect format");
    Schema = Schema.concat(Schema.matches(pattern, message));
  }

  if (isRegex(regex)) {
    const path = joinPath(description, "regex");
    const message = getError(path, "Incorrect format");
    Schema = Schema.concat(Schema.matches(regex, message));
  }

  if (format) {
    Schema = stringSchemaFormat(format, description, Schema);
  }
  return Schema;
};

export const stringSchemaFormat = (
  format: JSONSchema7Extended["format"],
  description: string | undefined,
  Schema: Yup.StringSchema
) => {
  if (format === "date-time") {
    const path = joinPath(description, "format.dateTime");
    const message = getError(path, "Date and time format is invalid");
    Schema = Schema.concat(Schema.matches(ISO_8601_DATE_TIME_REGEX, message));
  }

  if (format === "time") {
    const path = joinPath(description, "format.time");
    const message = getError(path, "Time format is invalid");
    Schema = Schema.concat(Schema.matches(ISO_8601_TIME_REGEX, message));
  }

  if (format === "date") {
    const path = joinPath(description, "format.date");
    const message = getError(path, "Date format is invalid");
    Schema = Schema.concat(Schema.matches(DATE_REGEX, message));
  }

  // email

  if (format === "email") {
    const path = joinPath(description, "format.email");
    const message = getError(path, "Email is invalid");
    Schema = Schema.concat(Schema.email(message));
  }

  // international email format

  if (format === "idn-email") {
    const path = joinPath(description, "format.idnEmail");
    const message = getError(path, "International email is invalid");
    Schema = Schema.concat(Schema.matches(INTERNATIONAL_EMAIL_REGEX, message));
  }

  // hostnames

  if (format === "hostname") {
    const path = joinPath(description, "format.hostname");
    const message = getError(path, "Hostname format is invalid");
    Schema = Schema.concat(Schema.matches(HOSTNAME_REGEX, message));
  }

  if (format === "idn-hostname") {
    const path = joinPath(description, "format.idnHostname");
    const message = getError(path, "International hostname format is invalid");
    Schema = Schema.concat(
      Schema.matches(INTERNATIONAL_HOSTNAME_REGEX, message)
    );
  }

  // ip addresses

  if (format === "ipv4") {
    const path = joinPath(description, "format.ipv4");
    const message = getError(path, "ipv4 format is invalid");
    Schema = Schema.concat(Schema.matches(IPV4_REGEX, message));
  }

  if (format === "ipv6") {
    const path = joinPath(description, "format.ipv6");
    const message = getError(path, "ipv6 format is invalid");
    Schema = Schema.concat(Schema.matches(IPV6_REGEX, message));
  }

  // resource identifiers

  if (format === "uri") {
    const path = joinPath(description, "format.uri");
    const message = getError(path, "URI format is invalid");
    Schema = Schema.concat(Schema.url(message));
  }

  if (format === "uri-reference") {
    const path = joinPath(description, "format.uriReference");
    const message = getError(path, "URI reference format is invalid");

    // `urlReference` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(Schema.urlReference(message));
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
