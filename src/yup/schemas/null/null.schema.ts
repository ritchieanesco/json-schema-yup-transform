import Yup from "../../addMethods";

/**
 * Initializes a yup null schema. Allows fields to be optional.
 */

const createNullSchema = (): Yup.MixedSchema<unknown> => {
  // Mark the schema as not required. Passing undefined
  // as value will not fail validation.
  return Yup.mixed().notRequired();
};

export default createNullSchema;
