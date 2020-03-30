import { JSONSchema7 } from "json-schema";
import Yup from "./yup/addMethods";
import build from "./yup";
import { normalize } from "./yup/utils";

/**
 * Converts a valid schema to a yup schema
 */
const convertToYup = (
  schema: JSONSchema7
): Yup.ObjectSchema<object> | undefined => {
  const normalizedSchema = normalize(schema);
  return build(normalizedSchema);
};

export default convertToYup;
