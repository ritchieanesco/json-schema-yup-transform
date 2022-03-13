import * as Yup from "yup";
import { DataTypes } from "../../schema";
import type { JSONSchema } from "../../schema";
import { getErrorMessage } from "../config";
import type { SchemaItem } from "../types";
import { createBaseNumberSchema } from "./number";

/**
 * Initializes a yup integer schema derived from a json humber schema
 */

const createIntegerSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.NumberSchema => {
  const defaultMessage =
    getErrorMessage(value.description, DataTypes.INTEGER, [
      key,
      { title: value.title }
    ]) || "This field is not of type integer";

  return createBaseNumberSchema(
    Yup.number().typeError(defaultMessage).integer().strict(true),
    [key, value],
    jsonSchema
  );
};

export default createIntegerSchema;
