import * as Yup from "yup";
import isBoolean from "lodash/isBoolean";
import capitalize from "lodash/capitalize";
import isEqual from "lodash/isEqual";
import type { SchemaItem } from "../types";
import type { JSONSchema } from "../../schema";

/**
 * Initializes a yup boolean schema derived from a json boolean schema
 */

const createBooleanSchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.BooleanSchema => {
  const label = value.title || capitalize(key);

  let yupSchema = Yup.boolean().typeError(`${label} is not of type boolean`);

  if (isBoolean(value.default))
  yupSchema =yupSchema.concat(yupSchema.default(value.default));

  if (typeof value.const !== "undefined") {
    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "constant",
        message: `${label} does not match constant`,
        test: (field: unknown): boolean => isEqual(field, value.const)
      })
    );
  }

  if (jsonSchema.required?.includes(key))
  yupSchema = yupSchema.concat(yupSchema.required(`${label} is required`));

  return yupSchema;
};

export default createBooleanSchema;
