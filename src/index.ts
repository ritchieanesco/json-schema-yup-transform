import { JSONSchema7 } from "json-schema";
import Yup from "./yup/addMethods";
import build, { setConfiguration, Config } from "./yup";
import { normalize } from "./yup/utils";

/**
 * Converts a valid schema to a yup schema
 */
const convertToYup = (
  schema: JSONSchema7,
  config?: Config
): Yup.ObjectSchema<object> | undefined => {
  config && setConfiguration(config);
  const normalizedSchema = normalize(schema);
  return build(normalizedSchema);
};

export default convertToYup;
