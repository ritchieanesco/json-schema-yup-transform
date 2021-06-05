import { JSONSchema7 } from "json-schema";
import { capitalize } from "lodash";
import createValidationSchema from "..";
import Yup from "../../addMethods";
import { getError } from "../../config";
import { joinPath } from "../../utils";

/**
 * To validate against anyOf, the given data must be valid against any (one or more) of the given subschemas.
 */
export const createAnyOfSchema = (
  [key, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const path = joinPath(value.description, "anyOf");
  const message = getError(path) || capitalize(`${key} does not match alternatives`);
  const schemas = value.anyOf?.map((val, i) => {
    return createValidationSchema([`${key}[${i}]`, val as JSONSchema7], jsonSchema);
  }) || [];

  return Yup.mixed().test(
    "one-of-schema",
    message,
    function (current) {
      return schemas.some(s => s.isValidSync(current, this.options))
    }
  );
}

/**
 * To validate against allOf, the given data must be valid against all of the given subschemas.
 */
export const createAllOfSchema = (
  [key, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const path = joinPath(value.description, "allOf");
  const message =
    getError(path) || capitalize(`${key} does not match all alternatives`);
  const schemas = value.allOf?.map((val, i) => {
    return createValidationSchema([`${key}[${i}]`, val as JSONSchema7], jsonSchema);
  }) || [];

  return Yup.mixed().test(
    "all-of-schema",
    message,
    function (current) {
      return schemas.every(s => s.isValidSync(current, this.options))
    }
  );
}

/**
 * To validate against oneOf, the given data must be valid against exactly one of the given subschemas.
 */
export const createOneOfSchema = (
  [key, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const path = joinPath(value.description, "oneOf");
  const message =
    getError(path) || capitalize(`${key} does not match one alternative`);
  const schemas = value.oneOf?.map((val, i) => {
    return createValidationSchema([`${key}[${i}]`, val as JSONSchema7], jsonSchema);
  }) || [];

  return Yup.mixed().test(
    "one-of-schema",
    message,
    function (current) {
      return schemas.filter(s => s.isValidSync(current, this.options)).length === 1;
    }
  );
}

/**
 * The not keyword declares that an instance validates if it doesn’t validate against the given subschema.
 */
export const createNotSchema = (
  [key, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const path = joinPath(value.description, "not");
  const message =
    getError(path) || capitalize(`${key} matches alternatives`);
  const schema = createValidationSchema([key, value.not as JSONSchema7], jsonSchema);

  return Yup.mixed().test(
    "not-schema",
    message,
    function (current) {
      return schema.isValidSync(current, this.options) === false;
    }
  );
}