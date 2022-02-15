import { JSONSchema7 } from "json-schema";
import capitalize from "lodash/capitalize";
import Yup from "../../addMethods";
import { createBaseNumberSchema } from "../number";
import { SchemaItem } from "../../types";
import { getErrorMessage } from "../../config/";
import { DataTypes } from "../../../schema";

/**
 * Initializes a yup integer schema derived from a json humber schema
 */

const createIntegerSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.NumberSchema<number> => {
  const {
    description,
    title
  } = value;

  const label = title || capitalize(key);
  const defaultMessage = getErrorMessage(description, DataTypes.INTEGER)
    || `${label} is not of type integer`;

  return createBaseNumberSchema(
    Yup.number().typeError(defaultMessage).integer().strict(true),
    [key, value],
    jsonSchema
  );
};

export default createIntegerSchema;
