import { JSONSchema7 } from "json-schema";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import { isSchemaObject, isItemsArray } from "../../../schema";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { createConditionSchema } from "../conditions";
import { SchemaItem } from "../../types";

/**
 * Initializes a yup array schema derived from a json boolean schema
 */

const createArraySchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7,
  recursive: boolean = false
): Yup.ArraySchema<unknown> => {
  const { default: defaults, minItems, maxItems, items, contains } = value;

  let Schema = Yup.array();

  if (isArray(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, key);

  // Recursive parameter prevents infinite loops when
  // initialised from conditional schema
  if (!recursive) {
    Schema = createConditionSchema(Schema, jsonSchema, key);
  }

  if (isNumber(minItems)) {
    // `minimumItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(
      Schema.minimumItems(minItems, `Minimum of ${minItems} items required`)
    );
  }

  if (isNumber(maxItems)) {
    // `maximumItems` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(
      Schema.maximumItems(maxItems, `Maximum of ${maxItems} items required`)
    );
  }

  // Items key expects all values to be of same type
  // Contains key expects one of the values to be of a type
  // These rules will conflict with each other so only
  // allow one or the other
  if (!contains && isSchemaObject(items)) {
    const { type } = items;

    // `list` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = isString(type)
      ? (Schema = Schema.concat(
          Schema.list(type, "All values of this array must be of the same type")
        ))
      : Schema;
  }

  if (!contains && isItemsArray(items)) {
    // `tuple` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = Schema.concat(
      Schema.tuple(items, "Must adhere to the expected data type")
    );
  }

  if (!isSchemaObject(items) && contains) {
    const { type } = contains as JSONSchema7;

    // `contains` is a custom yup method. See /yup/addons/index.ts
    // for implementation

    Schema = isString(type)
      ? Schema.concat(
          Schema.contains(
            type,
            `At least one item of this array must be of ${type} type`
          )
        )
      : Schema;
  }

  return Schema;
};

export default createArraySchema;
