import { JSONSchema7 } from "json-schema";
import * as Yup from "yup";
import * as yupTransformer from "./yup";
import { normalize } from "./yup/utils";

/**
 * Converts a valid schema to a yup schema
 */
const convertToYup = (
  schema: JSONSchema7,
  config?: yupTransformer.Config
): Yup.ObjectSchema<any> | undefined => {
  config && yupTransformer.setConfiguration(config);
  const normalizedSchema = normalize(schema);
  return yupTransformer.default(normalizedSchema);
};

export type Config = yupTransformer.Config;
export type CustomErrorMsgParam = yupTransformer.CustomErrorMsgParam
export default convertToYup;
