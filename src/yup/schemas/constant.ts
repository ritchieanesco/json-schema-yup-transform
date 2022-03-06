import capitalize from "lodash/capitalize";
import { SchemaKeywords } from "../../schema";
import Yup from "../addMethods";
import type { SchemaItem } from "../types";
import { getErrorMessage } from "../config";

/**
 * Add constant yup method when schema constant is declared
 */

export const createConstantSchema = <T extends Yup.Schema<unknown>>(
  Schema: T,
  [key, value]: SchemaItem
): T => {
  const { const: consts, description, title } = value;

  if (consts || consts === null || consts === 0) {
    const message = getErrorMessage(description, SchemaKeywords.CONST, [ key,  { const: consts?.toString(), title} ])
      || capitalize(`${key} does not match constant`);

    Schema = Schema.concat(Schema.constant(consts, message));
  }

  return Schema;
};
