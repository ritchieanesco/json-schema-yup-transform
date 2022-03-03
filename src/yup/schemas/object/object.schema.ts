import { JSONSchema7 } from "json-schema";
import capitalize from "lodash/capitalize";
import { SchemaItem } from "../../types";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { getErrorMessage } from "../../config/";
import { DataTypes } from "../../../schema";
import { buildProperties } from "../../builder";

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

  const defaultMessage = getErrorMessage(description, DataTypes.OBJECT, [key, { title }])
    || capitalize(`${label}  is not of type object`);

  // Seperate compositional schemas from standard schemas.
  // Standard schemas return Object schemas, compositional schemas return mixed or lazy schemas.
  // Lazy schemas can not be concatenated which will throw an error when traversing a nested object.
  const schm = JSON.stringify(jsonSchema.properties)
  const isComposition = schm.indexOf("anyOf") > -1 || schm.indexOf("oneOf") > -1

  let Schema: Yup.ObjectSchema
  if (isComposition) {
    let shape = value.properties && buildProperties(value.properties, jsonSchema);
    (value.required ?? []).forEach(requiredField => {
      if (shape !== undefined) {
        shape[requiredField] = createRequiredSchema(shape[requiredField], value, [requiredField, value])
      }
    });
    Schema = Yup.object(shape).typeError(defaultMessage);
  } else {
    Schema = Yup.object().typeError(defaultMessage);
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  return Schema;
};

export default createObjectSchema;
