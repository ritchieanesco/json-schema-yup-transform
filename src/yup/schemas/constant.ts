import capitalize from "lodash/capitalize";
import Yup from "../addMethods";
import { SchemaItem } from "../types";
import { getErrorMessage } from "../config";
import { SchemaKeywords } from "../../schema";

/**
 * Add constant yup method when schema constant is declared
 */

export const createConstantSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  [key, value]: SchemaItem
): T => {
  const { const: consts, description } = value;

  if (consts || consts === null || consts === 0) {
    const message = getErrorMessage(description, SchemaKeywords.CONST)
      || capitalize(`${key} does not match constant`);

    Schema = Schema.concat(Schema.constant(consts, message));
  }

  return Schema;
};
