import { JSONSchema7 } from "json-schema";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import { isItemsArray } from "../../../schema";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { SchemaItem } from "../../types";
import { getError } from "../../config/";
import { joinPath } from "../../utils";

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
    const: consts,
    enum: enums,
    uniqueItems
  } = value;

  const defaultMessage = getError(
    "defaults.array",
    "The value is not of type array"
  );

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

    const path = joinPath(description, "contains");
    const message = getError(
      path,
      `At least one item of this array must be of ${type} type`
    );

    // `contains` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = isString(type)
      ? Schema.concat(Schema.contains(type, message))
      : Schema;
  } else {
    if (isItemsArray(items)) {
      const path = joinPath(description, "tuple");
      const message = getError(path, "Must adhere to the expected data type");

      // `tuple` is a custom yup method. See /yup/addons/index.ts
      // for implementation

      Schema = Schema.concat(Schema.tuple(items, message));
    }
  }

  if (isNumber(minItems)) {
    const path = joinPath(description, "minItems");
    const message = getError(path, `Minimum of ${minItems} items required`);

    // `minimumItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(Schema.minimumItems(minItems, message));
  }

  if (isNumber(maxItems)) {
    const path = joinPath(description, "maxItems");
    const message = getError(path, `Maximum of ${maxItems} items required`);

    // `maximumItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(Schema.maximumItems(maxItems, message));
  }

  if (!isUndefined(consts)) {
    const path = joinPath(description, "const");
    const message = getError(path, "Value does not match constant");
    Schema = Schema.concat(Schema.constant(consts, message));
  }

  if (isArray(enums)) {
    const path = joinPath(description, "enum");
    const message = getError(path, "Value does not match enum");
    Schema = Schema.concat(Schema.enum(enums, message));
  }

  if (!isUndefined(uniqueItems)) {
    const path = joinPath(description, "uniqueItems");
    const message = getError(path, `Items in array are not unique`);

    // `uniqueItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(Schema.uniqueItems(uniqueItems, message));
  }

  return Schema;
};

export default createArraySchema;
