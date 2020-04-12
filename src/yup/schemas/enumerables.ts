import isArray from "lodash/isArray";
import capitalize from "lodash/capitalize";
import Yup from "../addMethods";
import { SchemaItem } from "../types";
import { getError } from "../config";
import { joinPath } from "../utils";

/**
 * Add enum yup method when schema enum is declared
 */

export const createEnumerableSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  [key, value]: SchemaItem
): T => {
  const { enum: enums, description } = value;

  if (isArray(enums)) {
    const path = joinPath(description, "enum");
    const message =
      getError(path) ||
      capitalize(`${key} does not match any of the enumerables`);
    Schema = Schema.concat(Schema.enum(enums, message));
  }

  return Schema;
};
