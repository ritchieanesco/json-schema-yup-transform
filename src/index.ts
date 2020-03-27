import { JSONSchema7 } from "json-schema";
import Yup from "./yup/addMethods";
import { cleanSchema as build } from "./yup";

/**
 * Converts a valid schema to a yup schema
 */
const convertToYup = (
  schema: JSONSchema7
): Yup.ObjectSchema<object> | undefined => {
  return build(schema);
};

export default convertToYup;
