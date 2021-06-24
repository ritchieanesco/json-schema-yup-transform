import { JSONSchema7 } from "json-schema";
import { capitalize } from "lodash";
import createValidationSchema from "..";
import Yup from "../../addMethods";
import { getErrorMessage } from "../../config";
import { AnyOfSchema7, AllOfSchema7, OneOfSchema7, NotSchema7, CompositSchemaTypes } from "../../../schema/types"

/**
 * To validate against anyOf, the given data must be valid against any (one or more) of the given subschemas.
 */
export const createAnyOfSchema = (
  [key, value]: [string, AnyOfSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const errorMessage = getErrorMessage(value.description, CompositSchemaTypes.ANYOF)
    || capitalize(`${key} does not match alternatives`);

  const schemas = value.anyOf.map((val, i) => createValidationSchema([`${key}[${i}]`, val as JSONSchema7], jsonSchema));

  return Yup.mixed().test(
    "one-of-schema",
    errorMessage,
    function (current) {
      return schemas.some(s => s.isValidSync(current, this.options))
    }
  );
}

/**
 * To validate against allOf, the given data must be valid against all of the given subschemas.
 */
export const createAllOfSchema = (
  [key, value]: [string, AllOfSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const errorMessage = getErrorMessage(value.description, CompositSchemaTypes.ALLOF)
    || capitalize(`${key} does not match all alternatives`);

  const schemas = value.allOf.map((val, i) => createValidationSchema([`${key}[${i}]`, val as JSONSchema7], jsonSchema));

  return Yup.mixed().test(
    "all-of-schema",
    errorMessage,
    function (current) {
      return schemas.every(s => s.isValidSync(current, this.options))
    }
  );
}

/**
 * To validate against oneOf, the given data must be valid against exactly one of the given subschemas.
 */
export const createOneOfSchema = (
  [key, value]: [string, OneOfSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const errorMessage = getErrorMessage(value.description, CompositSchemaTypes.ONEOF)
    || capitalize(`${key} does not match one alternative`);

  const schemas = value.oneOf.map((val, i) => createValidationSchema([`${key}[${i}]`, val as JSONSchema7], jsonSchema));

  return Yup.mixed().test(
    "one-of-schema",
    errorMessage,
    function (current) {
      return schemas.filter(s => s.isValidSync(current, this.options)).length === 1;
    }
  );
}

/**
 * The not keyword declares that an instance validates if it doesn’t validate against the given subschema.
 */
export const createNotSchema = (
  [key, value]: [string, NotSchema7],
  jsonSchema: JSONSchema7
): Yup.MixedSchema<string> => {
  const errorMessage = getErrorMessage(value.description, CompositSchemaTypes.NOT)
    || capitalize(`${key} matches alternatives`);

  const schema = createValidationSchema([key, value.not as JSONSchema7], jsonSchema);

  return Yup.mixed().test(
    "not-schema",
    errorMessage,
    function (current) {
      return schema.isValidSync(current, this.options) === false;
    }
  );
}