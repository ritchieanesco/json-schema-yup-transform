import capitalize from "lodash/capitalize";
import { DataTypes } from "../../../schema";
import type { JSONSchema } from "../../../schema"
import Yup from "../../addMethods";
import type { SchemaItem } from "../../types";
import { getErrorMessage } from "../../config/";
import { createBaseNumberSchema } from "../number";

/**
 * Initializes a yup integer schema derived from a json humber schema
 */

const createIntegerSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.NumberSchema<number> => {
  const {
    description,
    title
  } = value;

  const label = title || capitalize(key);
  const defaultMessage = getErrorMessage(description, DataTypes.INTEGER, [key, { title }])
    || `${label} is not of type integer`;

  return createBaseNumberSchema(
    Yup.number().typeError(defaultMessage).integer().strict(true),
    [key, value],
    jsonSchema
  );
};

export default createIntegerSchema;
