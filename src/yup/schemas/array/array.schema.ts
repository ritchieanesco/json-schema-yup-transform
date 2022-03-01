import { JSONSchema7 } from "json-schema";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import capitalize from "lodash/capitalize";
import { DataTypes, isItemsArray, SchemaKeywords } from "../../../schema";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { createConstantSchema } from "../constant";
import { createEnumerableSchema } from "../enumerables";
import { SchemaItem } from "../../types";
import { getErrorMessage } from "../../config/";

/**
 * Initializes a yup array schema derived from a json boolean schema
 */

const createArraySchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.ArraySchema<unknown> => {
  const {
    description,
    default: defaults,
    minItems,
    maxItems,
    items,
    contains,
    uniqueItems,
    title
  } = value;

  const label = title || capitalize(key);

  const defaultMessage =
    getErrorMessage(description, DataTypes.ARRAY) ||
    `${label} is not of type array`;

  let Schema = Yup.array().typeError(defaultMessage);

  if (isArray(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, [key, value]);

  // Items key expects all values to be of same type
  // Contains key expects one of the values to be of a type
  // These rules will conflict with each other so only
  // allow one or the other

  if (contains) {
    const { type } = contains as JSONSchema7;

    const message =
      getErrorMessage(description, SchemaKeywords.CONTAINS, [
        key,
        { title, contains: type?.toString() }
      ]) || capitalize(`${key} must at least contain one item of type ${type}`);

    // `contains` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = isString(type)
      ? Schema.concat(Schema.contains(type, message))
      : Schema;
  } else {
    if (isItemsArray(items)) {
      const message =
        getErrorMessage(description, SchemaKeywords.TUPLE, [key, { title }]) ||
        capitalize(`${key} must be of same type`);

      // `tuple` is a custom yup method. See /yup/addons/index.ts
      // for implementation

      Schema = Schema.concat(Schema.tuple(items, message));
    }
  }

  if (isNumber(minItems)) {
    const message =
      getErrorMessage(description, SchemaKeywords.MINIMUM_ITEMS, [
        key,
        { title, minItems }
      ]) || capitalize(`${key} requires a minimum of ${minItems} items`);

    // `minimumItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(Schema.minimumItems(minItems, message));
  }

  if (isNumber(maxItems)) {
    const message =
      getErrorMessage(description, SchemaKeywords.MAXIMUM_ITEMS, [
        key,
        { title, maxItems }
      ]) || capitalize(`${key} cannot exceed a maximum of ${maxItems} items`);

    // `maximumItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(Schema.maximumItems(maxItems, message));
  }

  /** Determine if schema matches constant */
  Schema = createConstantSchema(Schema, [key, value]);

  /** Determine if schema matches any enums */
  Schema = createEnumerableSchema(Schema, [key, value]);

  if (uniqueItems) {
    const message =
      getErrorMessage(description, SchemaKeywords.UNIQUE_ITEMS, [
        key,
        { title }
      ]) || capitalize(`${key} values are not unique`);

    // `uniqueItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(Schema.uniqueItems(uniqueItems, message));
  }

  return Schema;
};

export default createArraySchema;
