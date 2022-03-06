import isArray from "lodash/isArray";
import capitalize from "lodash/capitalize";
import { SchemaKeywords } from "../../schema";
import Yup from "../addMethods";
import type { SchemaItem } from "../types";
import { getErrorMessage } from "../config";

/**
 * Add enum yup method when schema enum is declared
 */

export const createEnumerableSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  [key, value]: SchemaItem
): T => {
  const { enum: enums, description, title } = value;
  if (isArray(enums)) {
    const message = getErrorMessage(description, SchemaKeywords.ENUM, [ key, { enum: enums.join(","), title } ])
      || capitalize(`${key} does not match any of the enumerables`);

    Schema = Schema.concat(Schema.enum(enums, message));
  }

  return Schema;
};
