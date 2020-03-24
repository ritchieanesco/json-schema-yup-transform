import Yup from "../../addMethods";

/**
 * Initializes a yup object schema derived from a json object schema
 */

const createObjectSchema = (): Yup.ObjectSchema<object> => {
  return Yup.object();
};

export default createObjectSchema;
