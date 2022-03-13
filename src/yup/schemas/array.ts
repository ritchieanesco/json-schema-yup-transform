import * as Yup from "yup";
import {
  isArray,
  isBoolean,
  isEqual,
  isInteger,
  isNumber,
  isPlainObject,
  isString,
  uniq
} from "lodash";
import stringifyObject from "stringify-object";
import {
  DataTypes,
  isSchemaObject,
  getItemsArrayItem,
  isTypeOfValue,
  SchemaKeywords
} from "../../schema";
import type { JSONSchema, JSONSchemaDefinition } from "../../schema";
import { getErrorMessage } from "../config";
import type { SchemaItem } from "../types";
import {
  createConstantSchema,
  createDefaultSchema,
  createEnumSchema,
  createRequiredSchema
} from "./util";

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
  required: JSONSchema["required"]
): Yup.ArraySchema<any> => {
  const {
    const: _const,
    default: _default,
    description,
    enum: _enum,
    items,
    maxItems,
    minItems,
    title,
    uniqueItems
  } = value;

  const defaultError =
    getErrorMessage(description, DataTypes.ARRAY, [key, { title }]) ||
    `This field is not of type array`;

  let yupSchema = Yup.array().typeError(defaultError);

  yupSchema = createDefaultSchema<Yup.ArraySchema<any>>(yupSchema, [
    Array.isArray(_default),
    _default
  ]);

  const requiredErrorMessage = getErrorMessage(
    description,
    SchemaKeywords.REQUIRED,
    [key, { title, required: required?.join(",") }]
  );
  yupSchema = createRequiredSchema<Yup.ArraySchema<any>>(yupSchema, [
    requiredErrorMessage,
    { key, required }
  ]);

  if (typeof value.contains?.type === "string") {
    const { type } = value.contains;

    const message =
      getErrorMessage(description, SchemaKeywords.CONTAINS, [
        key,
        { title, contains: type?.toString() }
      ]) || `This field must at least contain one item of type ${type}`;

    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "contains",
        message,
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
  } else if (Array.isArray(items)) {
    const message =
      getErrorMessage(description, SchemaKeywords.TUPLE, [key, { title }]) ||
      `This field must be of same type`;

    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "tuple",
        message,
        test: (field: any[] | undefined): boolean => {
          if (field === undefined) return true;
          const validate = validateTuple(items as JSONSchemaDefinition[]);
          return field.every(validate);
        }
      })
    );
  }

  if (typeof minItems === "number") {
    const message =
      getErrorMessage(description, SchemaKeywords.MINIMUM_ITEMS, [
        key,
        { title, minItems }
      ]) || `This field requires a minimum of ${minItems} items`;
    yupSchema = yupSchema.concat(yupSchema.min(minItems, message));
  }

  if (typeof maxItems === "number") {
    const message =
      getErrorMessage(description, SchemaKeywords.MAXIMUM_ITEMS, [
        key,
        { title, maxItems }
      ]) || `This field cannot exceed a maximum of ${maxItems} items`;
    yupSchema = yupSchema.concat(yupSchema.max(maxItems, message));
  }

  const constantErrorMessage = getErrorMessage(
    description,
    SchemaKeywords.CONST,
    [key, { const: _const?.toString(), title }]
  );
  yupSchema = createConstantSchema<Yup.ArraySchema<any>>(yupSchema, [
    constantErrorMessage,
    _const
  ]);

  const enumErrorMessage = getErrorMessage(description, SchemaKeywords.ENUM, [
    key,
    { enum: _enum?.join(","), title }
  ]);
  yupSchema = createEnumSchema<Yup.ArraySchema<any>>(yupSchema, [
    enumErrorMessage,
    _enum
  ]);

  if (uniqueItems) {
    const message =
      getErrorMessage(description, SchemaKeywords.UNIQUE_ITEMS, [
        key,
        { title, uniqueItems }
      ]) || `This field do not have unique values`;

    yupSchema = yupSchema.concat(
      yupSchema.test({
        name: "uniqueItems",
        message,
        test: (field): boolean => {
          if (field === undefined) return true;
          const normalisedArray = field.map((item: unknown) => {
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
