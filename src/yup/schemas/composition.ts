import * as Yup from "yup";
import { capitalize } from "lodash";
import { CompositSchemaTypes } from "../../schema"
import type { AnyOfSchema, AllOfSchema, JSONSchema, OneOfSchema , NotSchema } from "../../schema"
import createValidationSchema from ".";
import { getErrorMessage } from "../config";

/**
 * To validate against anyOf, the given data must be valid against any (one or more) of the given subschemas.
 */
export const createAnyOfSchema = (
  [key, value]: [string, AnyOfSchema],
  jsonSchema: JSONSchema
) => {
  const label = value.title || capitalize(key);
  const message = getErrorMessage(value.description, CompositSchemaTypes.ANYOF, [key, { title: value.title }]) || `${label} does not match alternatives`;
  const schemas = value.anyOf.map((val) =>
    createValidationSchema([key, val as JSONSchema], jsonSchema)
  );

  return Yup.mixed().test("one-of-schema", message, function (current) {
    return schemas.some((s) => s.isValidSync(current, this.options));
  });
};

/**
 * To validate against allOf, the given data must be valid against all of the given subschemas.
 */
export const createAllOfSchema = (
  [key, value]: [string, AllOfSchema],
  jsonSchema: JSONSchema
) => {
  const label = value.title || capitalize(key);
  const message = getErrorMessage(value.description, CompositSchemaTypes.ALLOF, [key, { title: value.title }]) || `${label} does not match all alternatives`;
  const schemas = value.allOf
    .filter((el) => typeof el !== "boolean" && el.type)
    .map((val, i) =>
      createValidationSchema([`${key}[${i}]`, val as JSONSchema], jsonSchema)
    );
  return Yup.mixed().test("all-of-schema", message, function (current) {
    return schemas.every((s) => s.isValidSync(current, this.options));
  });
};

/**
 * To validate against oneOf, the given data must be valid against exactly one of the given subschemas.
 */
export const createOneOfSchema = (
  [key, value]: [string, OneOfSchema],
  jsonSchema: JSONSchema
) => {
  const label = value.title || capitalize(key);
  const message = getErrorMessage(value.description, CompositSchemaTypes.ONEOF, [key, { title: value.title }]) || `${label} does not match one alternative`;
  const schemas = value.oneOf.map((val) => {
    return createValidationSchema([key, val as JSONSchema], jsonSchema)
  });

  return Yup.mixed().test("one-of-schema", message, function (current) {
    return schemas.filter((s) =>  {
      return s.isValidSync(current)
    }).length === 1
  });
};

/**
 * The not keyword declares that an instance validates if it doesn’t validate against the given subschema.
 */
export const createNotSchema = (
  [key, value]: [string, NotSchema],
  jsonSchema: JSONSchema
) => {
  const label = value.title || capitalize(key);
  const message = getErrorMessage(value.description, CompositSchemaTypes.NOT, [key, { title: value.title }]) || `${label} matches alternatives`;
  const schema = createValidationSchema(
    [key, value.not as JSONSchema],
    jsonSchema
  );

  return Yup.mixed().test("not-schema", message, function (current) {
    return schema.isValidSync(current, this.options) === false;
  });
};
