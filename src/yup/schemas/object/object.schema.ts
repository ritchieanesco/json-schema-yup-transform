import { JSONSchema7 } from "json-schema";
import capitalize from "lodash/capitalize";
import { SchemaItem } from "../../types";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { getErrorMessage } from "../../config/";
import { DataTypes } from "../../../schema";

/**
 * Initializes a yup object schema derived from a json object schema
 */

const createObjectSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.ObjectSchema<object> => {
  const {
    description,
    title
  } = value;

  const label = title || capitalize(key);

  const defaultMessage = getErrorMessage(description, DataTypes.OBJECT)
    || capitalize(`${label}  is not of type object`);

  let Schema = Yup.object().typeError(defaultMessage);

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  return Schema;
};

export default createObjectSchema;
