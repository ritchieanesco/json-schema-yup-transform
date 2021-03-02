import { MixedSchema } from "yup/lib/mixed";
import Yup from "../../addMethods";

/**
 * Initializes a yup null schema. Allows fields to be optional.
 */

const createNullSchema = (): MixedSchema => {
  // Mark the schema as not required. Passing undefined
  // as value will not fail validation.
  return Yup.mixed().notRequired();
};

export default createNullSchema;
