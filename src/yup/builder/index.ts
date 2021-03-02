import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import has from "lodash/has";
import get from "lodash/get";
import omit from "lodash/omit";
import isPlainObject from "lodash/isPlainObject";
import Yup from "../addMethods/";
import { getProperties, isSchemaObject } from "../../schema/";
import createValidationSchema from "../schemas/";
import { getObjectHead } from "../utils";
import { ObjectShape } from "yup/lib/object";
import { MixedSchema } from "yup/lib/mixed";
import Lazy from "yup/lib/Lazy";

/**
 * Iterate through each item in properties and generate a key value pair of yup schema
 */

const buildProperties = (
  properties: {
    [key: string]: JSONSchema7Definition;
  },
  jsonSchema: JSONSchema7
): {} | { [key: string]: Lazy<any> | MixedSchema } => {
  let schema = {};

  for (let [key, value] of Object.entries(properties)) {
    if (!isSchemaObject(value)) {
      continue;
    }
    const { properties, type, items } = value;

    // if item is object type call this function again
    if (type === "object" && properties) {
      const objSchema = build(value);
      if (objSchema) {
        const ObjectSchema = createValidationSchema([key, value], jsonSchema);
        schema = { ...schema, [key]: ObjectSchema.concat(objSchema) };
      }
    } else if (
      type === "array" &&
      isSchemaObject(items) &&
      has(items, "properties")
    ) {
      /** Structured to handle nested objects in schema. First
       * an array with all the relevant validation rules need to
       * be applied and then the subschemas will be concatenated.
       */
      const ArraySchema = createValidationSchema(
        [key, omit(value, "items")],
        jsonSchema
      );
      schema = {
        ...schema,
        [key]: ArraySchema.concat(Yup.array(build(items)))
      };
    } else if (type === "array" && isSchemaObject(items)) {
      const ArraySchema = createValidationSchema(
        [key, omit(value, "items")],
        jsonSchema
      );
      schema = {
        ...schema,
        [key]: ArraySchema.concat(
          Yup.array(createValidationSchema([key, items], jsonSchema))
        )
      };
    } else {
      // check if item has a then or else schema
      const condition = hasIfSchema(jsonSchema, key)
        ? buildCondition(jsonSchema)
        : {};
      const newSchema = createValidationSchema([key, value], jsonSchema);
      schema = {
        ...schema,
        [key]: key in schema ? schema[key].concat(newSchema) : newSchema,
        ...condition
      };
    }
  }
  return schema;
};

/**
 * Determine schema has a if schema
 */

const hasIfSchema = (jsonSchema: JSONSchema7, key: string): boolean => {
  const { if: ifSchema } = jsonSchema;
  if (!isSchemaObject(ifSchema)) return false;
  const { properties } = ifSchema;
  return isPlainObject(properties) && has(properties, key);
};

/**
 * High order function that takes json schema and property item
 * and generates a validation schema to validate the given value
 */

const isValidator = (
  [key, value]: [string, JSONSchema7],
  jsonSchema: JSONSchema7
) => (val: unknown): boolean => {
  const conditionalSchema = createValidationSchema([key, value], jsonSchema);
  const result: boolean = conditionalSchema.isValidSync(val);
  return result;
};

/** Build `is` and `then` validation schema */

const buildCondition = (
  jsonSchema: JSONSchema7
): false | { [key: string]: MixedSchema } => {
  const ifSchema = get(jsonSchema, "if");
  if (!isSchemaObject(ifSchema)) return false;

  const { properties } = ifSchema;
  if (!properties) return false;

  const ifSchemaHead = getObjectHead(properties);

  if (!ifSchemaHead) return false;
  const [ifSchemaKey, ifSchemaValue] = ifSchemaHead;

  if (!isSchemaObject(ifSchemaValue)) return false;

  const thenSchema = get(jsonSchema, "then");
  const elseSchema = get(jsonSchema, "else");

  let conditionSchema = {};

  if (isSchemaObject(thenSchema)) {
    const { properties, required } = thenSchema;
    if (!properties) return false;

    for (const [key, val] of Object.entries(properties)) {
      if (!val || typeof val === "boolean") continue;
      const item: { properties: {}; required?: string[] } = {
        properties: { [key]: { ...val } }
      };
      if (required && required.includes(key)) {
        item.required = [key];
      }
      const isValid = isValidator([ifSchemaKey, ifSchemaValue], item);
      const thenConditionSchema = buildConditionItem(item, [
        ifSchemaKey,
        (val) => isValid(val) === true
      ]);
      if (thenConditionSchema)
        conditionSchema = Object.assign(
          {},
          conditionSchema,
          thenConditionSchema
        );
    }
  }

  if (isSchemaObject(elseSchema)) {
    const isValid = isValidator([ifSchemaKey, ifSchemaValue], elseSchema);
    const elseConditionSchema = buildConditionItem(elseSchema, [
      ifSchemaKey,
      (val) => isValid(val) === false
    ]);
    if (!elseConditionSchema) return false;
    conditionSchema = { ...conditionSchema, ...elseConditionSchema };
  }
  return conditionSchema;
};

/**
 * Build the then/else schema as a yup when schema
 */

const buildConditionItem = (
  schema: JSONSchema7,
  [ifSchemaKey, callback]: [string, (val: unknown) => boolean]
): false | { [key: string]: MixedSchema } => {
  const { properties } = schema;
  if (!properties) return false;

  const schemaHead = getObjectHead(properties);
  if (!schemaHead) return false;
  const key = schemaHead[0];

  /**
   * Returns a key ( field name ) and value (generated schema) pair.
   * Note: This will contain any nested conditions!!
   * The recursion in `buildProperties` means the nested conditions
   * will already have been transformed to a when schema
   */
  const schemaData = buildProperties(properties, schema);
  if (!schemaData) return false;

  /**
   * Make a copy of schemaData and omit the current schema
   */
  const omitData = omit(schemaData, key);

  /** Get the correct schema type to concat the when schema to */
  let Schema = schemaData[key];
  return {
    [key]: Yup.mixed().when(ifSchemaKey, {
      is: callback,
      then: Schema
    }),
    ...omitData
  };
};

/**
 * Iterates through a valid JSON Schema and generates yup field level
 * and object level schema
 */

export const build = (
  jsonSchema: JSONSchema7
): Yup.ObjectSchema<ObjectShape> | undefined => {
  const properties = getProperties(jsonSchema);

  if (!properties) return properties;

  let Schema = buildProperties(properties, jsonSchema);
  return Yup.object().shape(Schema);
};

export default build;
