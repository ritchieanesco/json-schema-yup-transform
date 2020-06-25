import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import capitalize from "lodash/capitalize";
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
import { createConstantSchema } from "../constant";
import { createEnumerableSchema } from "../enumerables";
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
    regex
  } = value;

  const defaultMessage =
    getError("defaults.string") || capitalize(`${key} is not of type string`);

  let Schema = Yup.string().typeError(defaultMessage);

  if (isString(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  /** Determine if schema matches constant */
  Schema = createConstantSchema(Schema, [key, value]);

  /** Determine if schema matches any enums */
  Schema = createEnumerableSchema(Schema, [key, value]);

  if (isNumber(minLength)) {
    const path = joinPath(description, "minLength");
    const message =
      getError(path) ||
      capitalize(`${key} requires a minimum of ${minLength} characters`);
    Schema = Schema.concat(Schema.min(minLength, message));
  }

  if (isNumber(maxLength)) {
    const path = joinPath(description, "maxLength");
    const message =
      getError(path) ||
      capitalize(`${key} cannot exceed a maximum of ${maxLength} characters`);
    Schema = Schema.concat(Schema.max(maxLength, message));
  }

  if (isRegex(pattern)) {
    const path = joinPath(description, "pattern");
    const message =
      getError(path) || capitalize(`${key} is a incorrect format`);
    Schema = Schema.concat(Schema.matches(pattern, message));
  }

  if (isRegex(regex)) {
    const path = joinPath(description, "regex");
    const message =
      getError(path) || capitalize(`${key} is a incorrect format`);
    Schema = Schema.concat(Schema.matches(regex, message));
  }

  if (format) {
    Schema = stringSchemaFormat([key, value], Schema);
  }
  return Schema;
};

export const stringSchemaFormat = (
  [key, value]: [string, JSONSchema7Extended],
  Schema: Yup.StringSchema
) => {
  const { format, description } = value;

  if (format === "date-time") {
    const path = joinPath(description, "format.dateTime");
    const message =
      getError(path) || capitalize(`${key} is a invalid date and time format`);
    Schema = Schema.concat(Schema.matches(ISO_8601_DATE_TIME_REGEX, message));
  }

  if (format === "time") {
    const path = joinPath(description, "format.time");
    const message =
      getError(path) || capitalize(`${key} is a invalid time format`);
    Schema = Schema.concat(Schema.matches(ISO_8601_TIME_REGEX, message));
  }

  if (format === "date") {
    const path = joinPath(description, "format.date");
    const message =
      getError(path) || capitalize(`${key} is a invalid date format`);
    Schema = Schema.concat(Schema.matches(DATE_REGEX, message));
  }

  // email

  if (format === "email") {
    const path = joinPath(description, "format.email");
    const message =
      getError(path) || capitalize(`${key} is a invalid email format`);
    Schema = Schema.concat(Schema.email(message));
  }

  // international email format

  if (format === "idn-email") {
    const path = joinPath(description, "format.idnEmail");
    const message =
      getError(path) ||
      capitalize(`${key} is a invalid international email format`);
    Schema = Schema.concat(Schema.matches(INTERNATIONAL_EMAIL_REGEX, message));
  }

  // hostnames

  if (format === "hostname") {
    const path = joinPath(description, "format.hostname");
    const message =
      getError(path) || capitalize(`${key} is a invalid hostname format`);
    Schema = Schema.concat(Schema.matches(HOSTNAME_REGEX, message));
  }

  if (format === "idn-hostname") {
    const path = joinPath(description, "format.idnHostname");
    const message =
      getError(path) ||
      capitalize(`${key} is a invalid international hostname format`);
    Schema = Schema.concat(
      Schema.matches(INTERNATIONAL_HOSTNAME_REGEX, message)
    );
  }

  // ip addresses

  if (format === "ipv4") {
    const path = joinPath(description, "format.ipv4");
    const message =
      getError(path) || capitalize(`${key} is a invalid ipv4 format`);
    Schema = Schema.concat(Schema.matches(IPV4_REGEX, message));
  }

  if (format === "ipv6") {
    const path = joinPath(description, "format.ipv6");
    const message =
      getError(path) || capitalize(`${key} is a invalid ipv6 format`);
    Schema = Schema.concat(Schema.matches(IPV6_REGEX, message));
  }

  // resource identifiers

  if (format === "uri") {
    const path = joinPath(description, "format.uri");
    const message =
      getError(path) || capitalize(`${key} is a invalid URI format`);
    Schema = Schema.concat(Schema.url(message));
  }

  if (format === "uri-reference") {
    const path = joinPath(description, "format.uriReference");
    const message =
      getError(path) || capitalize(`${key} is a invalid URI reference format`);

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
