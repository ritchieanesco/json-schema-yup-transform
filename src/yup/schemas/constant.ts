import capitalize from "lodash/capitalize";
import Yup from "../addMethods";
import { SchemaItem } from "../types";
import { getError } from "../config";
import { joinPath } from "../utils";

/**
 * Add constant yup method when schema constant is declared
 */

export const createConstantSchema = <T extends Yup.Schema<any>>(
  Schema: T,
  [key, value]: SchemaItem
): T => {
  const { const: consts, description } = value;

  if (consts || consts === null || consts === 0 || consts === false) {
    const path = joinPath(description, "const");
    const message =
      getError(path) || capitalize(`${key} does not match constant`);
    Schema = Schema.concat(Schema.constant(consts, message));
  }

  return Schema;
};
