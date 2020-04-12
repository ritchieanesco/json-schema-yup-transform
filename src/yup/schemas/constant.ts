import { JSONSchema7 } from "json-schema";
import isUndefined from "lodash/isUndefined";
import capitalize from "lodash/capitalize";
import Yup from "../addMethods";
import { SchemaItem } from "../types";
import { getError } from "../config";
import { joinPath } from "../utils";

/**
 * Add required schema should subschema is required
 */

export const createConstantSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  jsonSchema: JSONSchema7,
  [key, value]: SchemaItem
): T => {
  const { const: consts, description } = value;

  if (!isUndefined(consts)) {
    const path = joinPath(description, "const");
    const message =
      getError(path) || capitalize(`${key} does not match constant`);
    Schema = Schema.concat(Schema.constant(consts, message));
  }

  return Schema;
};
