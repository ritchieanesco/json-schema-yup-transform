import { JSONSchema7 } from "json-schema";
import Yup from "./yup/addMethods";
import * as yupTransformer from "./yup";
import { normalize } from "./yup/utils";

/**
 * Converts a valid schema to a yup schema
 */
const convertToYup = (
  schema: JSONSchema7,
  config?: yupTransformer.Config
): Yup.ObjectSchema<object> | undefined => {
  config && yupTransformer.setConfiguration(config);
  const normalizedSchema = normalize(schema);
  return yupTransformer.default(normalizedSchema);
};

export type Config = yupTransformer.Config;
export type CustomErrorMsgParam = yupTransformer.CustomErrorMsgParam
export default convertToYup;
