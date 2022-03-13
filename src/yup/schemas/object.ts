import * as Yup from "yup";
import { DataTypes, SchemaKeywords } from "../../schema";
import type { JSONSchema } from "../../schema";
import type { SchemaItem } from "../types";
import { buildProperties } from "../builder";
import { getErrorMessage } from "../config";
import { createRequiredSchema } from "./util";

/**
 * Initializes a yup object schema derived from a json object schema
 */

const createObjectSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.AnyObjectSchema => {
  const defaultMessage =
    getErrorMessage(value.description, DataTypes.OBJECT, [
      key,
      { title: value.title }
    ]) || "This field is not of type object";

  // Seperate compositional schemas from standard schemas.
  // Standard schemas return Object schemas, compositional schemas return mixed or lazy schemas.
  // Lazy schemas can not be concatenated which will throw an error when traversing a nested object.
  const schm = JSON.stringify(jsonSchema.properties);
  const isComposition =
    schm.indexOf("anyOf") > -1 || schm.indexOf("oneOf") > -1;

  let yupSchema: Yup.AnyObjectSchema;
  if (isComposition) {
    let shape =
      value.properties && buildProperties(value.properties, jsonSchema);
    (value.required ?? []).forEach((requiredField) => {
      if (
        shape !== undefined &&
        (value.required as string[]).includes(requiredField)
      ) {
        shape[requiredField] = shape[requiredField].required();
      }
    });
    yupSchema = Yup.object(shape).typeError(defaultMessage);
  } else {
    yupSchema = Yup.object().typeError(defaultMessage);
  }

  const required =
    jsonSchema.type === "object" ? jsonSchema.required : value.required;

  const requiredErrorMessage = getErrorMessage(
    value.description,
    SchemaKeywords.REQUIRED,
    [key, { title: value.title, required: required?.join(",") }]
  );

  yupSchema = createRequiredSchema<Yup.AnyObjectSchema>(yupSchema, [
    requiredErrorMessage,
    { key, required }
  ]);

  return yupSchema;
};

export default createObjectSchema;
