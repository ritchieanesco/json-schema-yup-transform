import * as Yup from "yup";

/**
 * Initializes a yup null schema. Allows fields to be optional.
 */

const createNullSchema = (
  schema: Yup.NumberSchema | Yup.StringSchema | Yup.BooleanSchema
) => {
  // Mark the schema as not required. Passing undefined
  // as value will not fail validation.
  return schema.nullable();
};

export default createNullSchema;
