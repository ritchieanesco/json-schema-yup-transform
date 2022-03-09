import * as Yup from "yup";
import isEqual from "lodash/isEqual";
import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import isInteger from "lodash/isInteger";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import capitalize from "lodash/capitalize";
import isPlainObject from "lodash/isPlainObject";
import stringifyObject from "stringify-object";
import uniq from "lodash/uniq";
import { isSchemaObject, getItemsArrayItem, isTypeOfValue } from "../../schema";
import type { SchemaItem } from "../types";
import type { JSONSchema, JSONSchemaDefinition } from "../../schema";

const validateTuple =
  (items: JSONSchemaDefinition[]) =>
  (item: string | number, index: number): boolean => {
    const schemaItem = getItemsArrayItem(items, index);

    if (!isSchemaObject(schemaItem)) return false;

    const { type, enum: enums, const: consts } = schemaItem;

    // Items do not support multiple types
    if (!isString(type) || !isTypeOfValue[type](item)) return false;

    // enums and consts are only applicable to
    // types, numbers and integers
    if (
      type === "string" ||
      type === "number" ||
      type === "integer" ||
      type === "array"
    ) {
      if (enums && !(isArray(enums) && enums.some((en) => isEqual(en, item))))
        return false;

      if ((consts || consts === null || consts === 0) && !isEqual(item, consts))
        return false;
    }

    return true;
  };

/**
 * Initializes a yup array schema derived from a json boolean schema
 */

const createArraySchema = (
  [key, value]: SchemaItem,
  jsonSchema: JSONSchema
): Yup.ArraySchema<any> => {
  const label = value.title || capitalize(key);

  let yupSchema = Yup.array().typeError(`${label} is not of type array`);

  if (Array.isArray(value.default))
    yupSchema = yupSchema.concat(yupSchema.default(value.default));

  if (jsonSchema.required?.includes(key))
    yupSchema = yupSchema.concat(yupSchema.required(`${label} is required`));

  if (typeof value.contains?.type === "string") {
    const { type } = value.contains;

    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "contains",
        message: `${label} must at least contain one item of type ${type}`,
        test: (field: unknown[] | undefined): boolean => {
          if (field === undefined) return true;
          if (Array.isArray(field)) {
            const fn = (cb: () => boolean) => field.some(cb);
            if (type === "number") return fn(isNumber);
            if (type === "integer") return fn(isInteger);
            if (type === "string") return fn(isString);
            if (type === "boolean") return fn(isBoolean);
            if (type === "object") return fn(isPlainObject);
            if (type === "array") return fn(isArray);
          }
          return false;
        }
      })
    );
  } else if (Array.isArray(value.items)) {
    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "tuple",
        message: "${path} is not a tuple",
        test: (field: any[] | undefined): boolean => {
          if (field === undefined) return true;
          const validate = validateTuple(
            value.items as JSONSchemaDefinition[]
          );
          return field.every(validate);
        }
      })
    );
  }

  if (typeof value.minItems === "number") {
    const message = `${label} requires a minimum of ${value.minItems} items`;
    yupSchema = yupSchema.concat(yupSchema.min(value.minItems, message));
  }

  if (typeof value.maxItems === "number") {
    const message = `${label} cannot exceed a maximum of ${value.maxItems} items`;
    yupSchema = yupSchema.concat(yupSchema.max(value.maxItems, message));
  }

  if (typeof value.const !== "undefined") {
    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "constant",
        message: `${label} does not match constant`,
        test: (field: unknown): boolean => {
          if (field === undefined) return true;
          return isEqual(field, value.const);
        }
      })
    );
  }

  if (Array.isArray(value.enum)) {
    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "enum",
        message: `${label} does not match any of the enumerables`,
        test: (field: unknown): boolean => {
          if (field === undefined) return true;
          return (value.enum as unknown[]).some((item) => isEqual(item, field));
        }
      })
    );
  }

  if (value.uniqueItems) {
    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "uniqueItems",
        message: `${label} values are not unique`,
        test: (field): boolean => {
          if (field === undefined) return true;
          const normalisedArray = field.map((item) => {
            if (Array.isArray(item) || isPlainObject(item))
              return stringifyObject(item).replace(/\s/g, "");
            return item;
          });
          return uniq(normalisedArray).length === normalisedArray.length;
        }
      })
    );
  }

  return yupSchema;
};

export default createArraySchema;
