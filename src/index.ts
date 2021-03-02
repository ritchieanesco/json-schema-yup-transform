import { JSONSchema7 } from "json-schema";
import Yup from "./yup/addMethods";
import * as yupTransformer from "./yup";
import { normalize } from "./yup/utils";
import { ObjectShape } from "yup/lib/object";

/**
 * Converts a valid schema to a yup schema
 */
const convertToYup = (
  schema: JSONSchema7,
  config?: yupTransformer.Config
): Yup.ObjectSchema<ObjectShape> | undefined => {
  config && yupTransformer.setConfiguration(config);
  const normalizedSchema = normalize(schema);
  return yupTransformer.default(normalizedSchema);
};

export type Config = yupTransformer.Config;
export default convertToYup;
