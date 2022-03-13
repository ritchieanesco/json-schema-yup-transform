import * as Yup from "yup";
import isNumber from "lodash/isNumber";
import capitalize from "lodash/capitalize";
import isString from "lodash/isString";
import isRelativeUrl from "is-relative-url";
import { getErrorMessage } from "../config";
import { DataTypes, SchemaKeywords } from "../../schema";
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
  const {
    const: _const,
    default: _default,
    description,
    enum: _enum,
    format,
    maxLength,
    minLength,
    pattern,
    regex,
    required,
    title
  } = value;

  const label = title || capitalize(key);

  const defaultMessage =
    getErrorMessage(description, DataTypes.STRING, [key, { title }]) ||
    `${label} is not of type string`;

  let yupSchema = Yup.string().typeError(defaultMessage);

  yupSchema = createDefaultSchema<Yup.StringSchema>(yupSchema, [
    isString(_default),
    _default
  ]);

  const requiredErrorMessage =
    getErrorMessage(description, SchemaKeywords.REQUIRED, [
      key,
      { title, required: required?.join(",") }
    ]) || `${label} is required`;

  yupSchema = createRequiredSchema<Yup.StringSchema>(yupSchema, [
    requiredErrorMessage,
    { key, required: jsonSchema.required }
  ]);

  const constantErrorMessage =
    getErrorMessage(description, SchemaKeywords.CONST, [
      key,
      { const: _const?.toString(), title }
    ]) || `${label} does not match constant`;

  yupSchema = createConstantSchema<Yup.StringSchema>(yupSchema, [
    constantErrorMessage,
    _const as string
  ]);

  const enumErrorMessage =
    getErrorMessage(description, SchemaKeywords.ENUM, [
      key,
      { enum: _enum?.join(","), title }
    ]) || `${label} does not match any of the enumerables`;

  yupSchema = createEnumSchema<Yup.StringSchema>(yupSchema, [
    enumErrorMessage,
    _enum
  ]);

  if (isNumber(minLength)) {
    const message =
      getErrorMessage(description, SchemaKeywords.MINIMUM_LENGTH, [
        key,
        { title, minLength }
      ]) || `${label} requires a minimum of ${minLength} characters`;

    yupSchema = yupSchema.concat(yupSchema.min(minLength, message));
  }

  if (isNumber(maxLength)) {
    const message =
      getErrorMessage(description, SchemaKeywords.MAXIMUM_LENGTH, [
        key,
        { title, maxLength }
      ]) || `${label} cannot exceed a maximum of ${maxLength} characters`;

    yupSchema = yupSchema.concat(yupSchema.max(maxLength, message));
  }

  if (typeof pattern !== "undefined") {
    const message =
      getErrorMessage(description, SchemaKeywords.PATTERN, [
        key,
        { title, pattern: pattern.toString() }
      ]) || `${label} is an incorrect format`;

    yupSchema = yupSchema.concat(
      yupSchema.matches(new RegExp(pattern), message)
    );
  }

  if (typeof regex !== "undefined") {
    const message =
      getErrorMessage(description, SchemaKeywords.REGEX, [
        key,
        { title, regex: regex.toString() }
      ]) || `${label} is an incorrect format`;

    yupSchema = yupSchema.concat(yupSchema.matches(new RegExp(regex), message));
  }

  if (format)
    yupSchema = yupSchema.concat(
      createStringSchemaFormat([key, value], yupSchema)
    );

  return yupSchema;
};

export const createStringSchemaFormat = (
  [key, value]: [string, JSONSchemaExtended],
  yupSchema: Yup.StringSchema
): Yup.StringSchema => {
  const { description, format, title } = value;

  const label = title || capitalize(key);
  const message = getErrorMessage(description, SchemaKeywords.FORMAT, [
    key,
    { title, format }
  ]);

  if (format === "date-time")
    return yupSchema.matches(
      ISO_8601_DATE_TIME_REGEX,
      message ?? `${label} is an invalid date and time format`
    );

  if (format === "time")
    return yupSchema.matches(
      ISO_8601_TIME_REGEX,
      message ?? `${label} is an invalid time format`
    );

  if (format === "date")
    return yupSchema.matches(
      DATE_REGEX,
      message ?? `${label} is an invalid date format`
    );

  if (format === "email")
    return yupSchema.email(message ?? `${label} is an invalid email format`);

  if (format === "idn-email")
    return yupSchema.matches(
      INTERNATIONAL_EMAIL_REGEX,
      message ?? `${label} is an invalid international email format`
    );

  if (format === "hostname")
    return yupSchema.matches(
      HOSTNAME_REGEX,
      message ?? `${label} is an invalid hostname format`
    );

  if (format === "idn-hostname")
    return yupSchema.matches(
      INTERNATIONAL_HOSTNAME_REGEX,
      message ?? `${label} is an invalid international hostname format`
    );

  if (format === "ipv4")
    return yupSchema.matches(
      IPV4_REGEX,
      message ?? `${label} is an invalid ipv4 format`
    );

  if (format === "ipv6")
    return yupSchema.matches(
      IPV6_REGEX,
      message ?? `${label} is an invalid ipv6 format`
    );

  if (format === "uri")
    return yupSchema.url(message ?? `${label} is an invalid URI format`);

  if (format === "uri-reference") {
    return yupSchema.test({
      name: "uri-reference",
      message: message ?? `${label} is an invalid URI reference format`,
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
