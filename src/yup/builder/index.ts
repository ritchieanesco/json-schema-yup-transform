import * as Yup from "yup";
import has from "lodash/has";
import get from "lodash/get";
import omit from "lodash/omit";
import isPlainObject from "lodash/isPlainObject";
import type { JSONSchema, JSONSchemaDefinition } from "../../schema";
import { getProperties, isSchemaObject } from "../../schema/";
import createValidationSchema from "../schemas/";
import { getObjectHead } from "../utils";

/**
 * Iterate through each item in properties and generate a key value pair of yup schema
 */

export const buildProperties = (
  properties: {
    [key: string]: JSONSchemaDefinition;
  },
  jsonSchema: JSONSchema
) => {
  let schema = {};

  for (let [key, value] of Object.entries(properties)) {
    if (!isSchemaObject(value)) {
      continue;
    }

    const { properties, type, items } = value;

    // If item is object type call this function again
    if (type === "object" && properties) {
      const objSchema = build(value);
      if (objSchema) {
        const ObjectSchema = createValidationSchema([key, value], jsonSchema);
        schema = {
          ...schema,
          [key]: (ObjectSchema as Yup.ObjectSchema<any>).concat(objSchema)
        };
      }
    } else if (
      type === "array" &&
      isSchemaObject(items) &&
      has(items, "properties")
    ) {
      // Structured to handle nested objects in schema. First an array with all the relevant validation rules need to be applied and then the subschemas will be concatenated.
      const ArraySchema = createValidationSchema(
        [key, omit(value, "items")],
        jsonSchema
      );
      schema = {
        ...schema,
        [key]: (ArraySchema as Yup.ArraySchema<any>).concat(
          Yup.array(build(items))
        )
      };
    } else if (type === "array" && isSchemaObject(items)) {
      const ArraySchema = createValidationSchema(
        [key, omit(value, "items")],
        jsonSchema
      );
      schema = {
        ...schema,
        [key]: (ArraySchema as Yup.ArraySchema<any>).concat(
          Yup.array(createValidationSchema([key, items], jsonSchema))
        )
      };
    } else if (hasIfSchema(jsonSchema, key)) {
      schema = {
        ...schema,
        ...createConditionalSchema(jsonSchema)
      };
    } else if (hasAllOfIfSchema(jsonSchema, key)) {
      schema = {
        ...schema,
        ...jsonSchema.allOf?.reduce((all, schema) => {
          if (typeof schema === "boolean") {
            return all;
          }
          return { ...all, ...createConditionalSchema(schema) };
        }, [])
      };
    } else {
      schema = {
        ...schema,
        ...(key in schema
          ? {}
          : { [key]: createValidationSchema([key, value], jsonSchema) })
      };
    }
  }
  return schema;
};

/**
 * Determine schema has a if schema
 */

const hasIfSchema = (jsonSchema: JSONSchema, key: string): boolean => {
  const { if: ifSchema } = jsonSchema;
  if (!isSchemaObject(ifSchema)) return false;
  const { properties } = ifSchema;
  return isPlainObject(properties) && has(properties, key);
};

/**
 * Determine schema has at least one if schemas inside an allOf array
 */

const hasAllOfIfSchema = (jsonSchema: JSONSchema, key: string): boolean => {
  const { allOf } = jsonSchema;

  if (!allOf) {
    return false;
  }

  return allOf.some(
    (schema) => typeof schema !== "boolean" && hasIfSchema(schema, key)
  );
};

/**
 * High order function that takes json schema and property item
 * and generates a validation schema to validate the given value
 */

const isValidator =
  ([key, value]: [string, JSONSchema], jsonSchema: JSONSchema) =>
  (val: unknown): boolean => {
    const conditionalSchema = createValidationSchema([key, value], jsonSchema);
    const result: boolean = conditionalSchema.isValidSync(val);
    return result;
  };

/** Build `is`, `then`, `otherwise` validation schema */

const createConditionalSchema = (jsonSchema: JSONSchema) => {
  const ifSchema = get(jsonSchema, "if");
  if (!isSchemaObject(ifSchema)) return false;

  const { properties } = ifSchema;
  if (!properties) return false;

  const ifSchemaHead = getObjectHead(properties);
  if (!ifSchemaHead) return false;

  const [ifSchemaKey, ifSchemaValue] = ifSchemaHead;
  if (!isSchemaObject(ifSchemaValue)) return false;

  const thenSchema = get(jsonSchema, "then");

  if (isSchemaObject(thenSchema)) {
    const elseSchema = get(jsonSchema, "else");
    const isValid = isValidator([ifSchemaKey, ifSchemaValue], ifSchema);
    return createIsThenOtherwiseSchema(
      [ifSchemaKey, isValid],
      thenSchema,
      elseSchema
    );
  }

  return false;
};

/** `createIsThenOtherwiseSchemaItem` accepts an item from the "else" and "then" schemas and returns a yup schema for each item which will be used for the then or otherwise methods in when. */

const createIsThenOtherwiseSchemaItem = (
  [key, value]: [string, NonNullable<JSONSchema>],
  required: JSONSchema["required"]
) => {
  const item: JSONSchema = {
    properties: { [key]: { ...value } }
  };
  if (required && required.includes(key)) {
    item.required = [key];
  }
  if (!item.properties) return false;
  const thenSchemaData = buildProperties(item.properties, item);
  return thenSchemaData[key];
};

/** `createIsThenOtherwiseSchema` generates a yup when schema. */

const createIsThenOtherwiseSchema = (
  [ifSchemaKey, callback]: [string, (val: unknown) => boolean],
  thenSchema: JSONSchema,
  elseSchema?: JSONSchemaDefinition
) => {
  if (!thenSchema.properties) return false;

  let thenKeys = Object.keys(thenSchema.properties);
  // Collect all else schema keys and deduct from list when there is a matching then schema key. The remaining else keys will then be handled seperately.
  let elseKeys =
    typeof elseSchema === "object" && elseSchema.properties
      ? Object.keys(elseSchema.properties)
      : [];

  const schema = {};

  // Iterate through then schema and check for matching else schema keys and toggle between each rule pending if condition.

  for (const thenKey of thenKeys) {
    const thenIItem = thenSchema.properties[thenKey];
    if (!isSchemaObject(thenIItem)) continue;

    let thenSchemaItem = createIsThenOtherwiseSchemaItem(
      [thenKey, thenIItem],
      thenSchema.required
    );

    let matchingElseSchemaItem = false;

    if (
      isSchemaObject(elseSchema) &&
      elseSchema.properties &&
      thenKey in elseSchema.properties
    ) {
      matchingElseSchemaItem = createIsThenOtherwiseSchemaItem(
        [thenKey, elseSchema.properties[thenKey] as JSONSchema],
        elseSchema.required
      );
      // Remove matching else schema keys from list so remaining else schema keys can be handled separately.
      if (elseKeys.length) elseKeys.splice(elseKeys.indexOf(thenKey), 1);
    }

    schema[thenKey] = {
      is: callback,
      then: thenSchemaItem,
      ...(matchingElseSchemaItem ? { otherwise: matchingElseSchemaItem } : {})
    };
  }

  // Generate schemas for else keys that do not match the "then" schema.
  if (elseKeys.length) {
    elseKeys.forEach((k) => {
      if (
        isSchemaObject(elseSchema) &&
        elseSchema.properties &&
        k in elseSchema.properties
      ) {
        const elseSchemaItem = createIsThenOtherwiseSchemaItem(
          [k, elseSchema.properties[k] as JSONSchema],
          elseSchema.required
        );

        if (elseSchemaItem) {
          schema[k] = {
            // Hardcode false as else schema's should handle "unhappy" path.
            is: (schema: unknown) => !callback(schema),
            then: elseSchemaItem
          };
        }
      }
    });
  }

  // Generate Yup.when schemas from the schema object.
  const conditionals = Object.keys(schema).reduce((accum, next) => {
    accum[next] = Yup.mixed().when(ifSchemaKey, { ...schema[next] });
    return accum;
  }, {});

  // Create conditional schema for if schema's within else schema.
  let nestedConditionalSchemas = {};
  if (isSchemaObject(elseSchema) && get(elseSchema, "if")) {
    nestedConditionalSchemas = {
      ...nestedConditionalSchemas,
      ...createConditionalSchema(elseSchema)
    };
  }
  return { ...conditionals, ...nestedConditionalSchemas };
};

/**
 * Iterates through a valid JSON Schema and generates yup field level
 * and object level schema
 */

export const build = (
  jsonSchema: JSONSchema
): Yup.ObjectSchema<any> | undefined => {
  const properties = getProperties(jsonSchema);

  if (!properties) return properties;

  let schema = buildProperties(properties, jsonSchema);
  return Yup.object().shape(schema);
};

export default build;
