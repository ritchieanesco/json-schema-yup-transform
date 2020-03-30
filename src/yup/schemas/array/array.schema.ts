import { JSONSchema7 } from "json-schema";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import { isSchemaObject, isItemsArray } from "../../../schema";
import Yup from "../../addMethods";
import { createRequiredSchema } from "../required";
import { SchemaItem } from "../../types";
import { build } from "../../builder/builder";
import { DataTypes } from "../../../schema/";

/** Table of item types */
const itemsType = {
  [DataTypes.STRING]: () => Yup.string(),
  [DataTypes.NUMBER]: () => Yup.number(),
  [DataTypes.BOOLEAN]: () => Yup.boolean(),
  [DataTypes.OBJECT]: () => Yup.object(),
  [DataTypes.NULL]: () => Yup.mixed().notRequired(),
  [DataTypes.ARRAY]: () => Yup.array(),
  [DataTypes.INTEGER]: () => Yup.number().integer()
};

/**
 * Initializes a yup array schema derived from a json boolean schema
 */

const createArraySchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema7
): Yup.ArraySchema<unknown> => {
  const { default: defaults, minItems, maxItems, items, contains } = value;

  let Schema = Yup.array();

  if (isArray(defaults)) {
    Schema = Schema.concat(Schema.default(defaults));
  }

  /** Set required if ID is in required schema */
  Schema = createRequiredSchema(Schema, jsonSchema, key);

  // Items key expects all values to be of same type
  // Contains key expects one of the values to be of a type
  // These rules will conflict with each other so only
  // allow one or the other

  if (contains) {
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
  } else {
    // items schema can be either a object or an array

    if (isSchemaObject(items)) {
      console.log("handle array items");

      const { type, properties } = items;
      if (isSchemaObject(properties)) {
        // transform objects
        const obj = build(items);
        if (obj) {
          Schema = Schema.concat(Yup.array(obj));
        }
      } else {
        // items can only support a single type
        Schema = isString(type)
          ? Schema.concat(Yup.array().of(itemsType[type]().strict(true)))
          : Schema;
      }
    }

    if (isItemsArray(items)) {
      // `tuple` is a custom yup method. See /yup/addons/index.ts
      // for implementation

      Schema = Schema.concat(
        Schema.tuple(items, "Must adhere to the expected data type")
      );
    }
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

  return Schema;
};

export default createArraySchema;
