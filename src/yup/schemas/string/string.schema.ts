import isNumber from "lodash/isNumber";
import capitalize from "lodash/capitalize";
import type { JSONSchemaExtended } from "../../../schema";
import { DataTypes, SchemaKeywords } from "../../../schema";
import Yup from "../../addMethods";
import { getErrorMessage } from "../../config/";
import { createRequiredSchema } from "../required";
import { createConstantSchema } from "../constant";
import { createEnumerableSchema } from "../enumerables";
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

/**
 * Initializes a yup string schema derived from a json string schema
 */

const createStringSchema = (
  [key, value]: [string, JSONSchemaExtended],
  jsonSchema: JSONSchemaExtended
): Yup.StringSchema<string> => {
  const {
    description,
    default: defaults,
    minLength,
    maxLength,
    pattern,
    format,
    regex,
    title
  } = value;

  const label = title || capitalize(key);

  const defaultMessage =
    getErrorMessage(description, DataTypes.STRING, [key, { title }]) ||
    capitalize(`${label} is not of type string`);

  let Schema = Yup.string().typeError(defaultMessage);

  if (defaults) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  /** Determine if schema matches constant */
  Schema = createConstantSchema(Schema, [key, value]);

  /** Determine if schema matches any enums */
  Schema = createEnumerableSchema(Schema, [key, value]);

  if (isNumber(minLength)) {
    const message =
      getErrorMessage(description, SchemaKeywords.MINIMUM_LENGTH, [
        key,
        { title, minLength }
      ]) || `${label} requires a minimum of ${minLength} characters`;

    Schema = Schema.concat(Schema.min(minLength, message));
  }

  if (isNumber(maxLength)) {
    const message =
      getErrorMessage(description, SchemaKeywords.MAXIMUM_LENGTH, [
        key,
        { title, maxLength }
      ]) || `${label} cannot exceed a maximum of ${maxLength} characters`;

    Schema = Schema.concat(Schema.max(maxLength, message));
  }

  if (pattern) {
    const reg = new RegExp(pattern);
    const message =
      getErrorMessage(description, SchemaKeywords.PATTERN, [
        key,
        { title, pattern: reg.toString() }
      ]) || `${label} is an incorrect format`;

    Schema = Schema.concat(Schema.matches(reg, message));
  }

  if (regex) {
    const reg = new RegExp(regex);
    const message =
      getErrorMessage(description, SchemaKeywords.REGEX, [
        key,
        { title, regex: reg.toString() }
      ]) || `${label} is an incorrect format`;

    Schema = Schema.concat(Schema.matches(reg, message));
  }

  if (format) {
    Schema = stringSchemaFormat([key, value], Schema);
  }
  return Schema;
};

export const stringSchemaFormat = (
  [key, value]: [string, JSONSchemaExtended],
  Schema: Yup.StringSchema
) => {
  const { format, description, title } = value;

  const label = title || capitalize(key);

  if (format === "date-time") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid date and time format`;
    Schema = Schema.concat(Schema.matches(ISO_8601_DATE_TIME_REGEX, message));
  }

  if (format === "time") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid time format`;
    Schema = Schema.concat(Schema.matches(ISO_8601_TIME_REGEX, message));
  }

  if (format === "date") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid date format`;
    Schema = Schema.concat(Schema.matches(DATE_REGEX, message));
  }

  // email

  if (format === "email") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid email format`;
    Schema = Schema.concat(Schema.email(message));
  }

  // international email format

  if (format === "idn-email") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid international email format`;
    Schema = Schema.concat(Schema.matches(INTERNATIONAL_EMAIL_REGEX, message));
  }

  // hostnames

  if (format === "hostname") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid hostname format`;
    Schema = Schema.concat(Schema.matches(HOSTNAME_REGEX, message));
  }

  if (format === "idn-hostname") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid international hostname format`;
    Schema = Schema.concat(
      Schema.matches(INTERNATIONAL_HOSTNAME_REGEX, message)
    );
  }

  // ip addresses

  if (format === "ipv4") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid ipv4 format`;
    Schema = Schema.concat(Schema.matches(IPV4_REGEX, message));
  }

  if (format === "ipv6") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid ipv6 format`;
    Schema = Schema.concat(Schema.matches(IPV6_REGEX, message));
  }

  // resource identifiers

  if (format === "uri") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid URI format`;
    Schema = Schema.concat(Schema.url(message));
  }

  if (format === "uri-reference") {
    const message =
      getErrorMessage(description, SchemaKeywords.FORMAT, [
        key,
        { title, format }
      ]) || `${label} is an invalid URI reference format`;

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
