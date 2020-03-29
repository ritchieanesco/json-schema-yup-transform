import { JSONSchema7 } from "json-schema";
import { isSchemaObject } from "../../schema/";
import get from "lodash/get";
import has from "lodash/has";

const addConditionToProperties = (
  jsonSchema: JSONSchema7,
  condition: JSONSchema7
): JSONSchema7 => {
  const { properties: props } = condition;
  let newSchema = {};
  if (props) {
    for (let [key, value] of Object.entries(props)) {
      const type = get(value, "type");
      if (has(value, "type")) {
        newSchema = {
          ...newSchema,
          [key]: {
            type
          }
        };
      }
    }
  }
  return {
    ...jsonSchema,
    properties: {
      ...jsonSchema.properties,
      ...newSchema
    }
  };
};

const sanitiseConditions = (
  jsonSchema: JSONSchema7,
  schema: JSONSchema7,
  key: string
) => {
  const { properties: schemaProperties } = jsonSchema;
  const { properties: props } = schema;
  let newSchema = {};
  if (props) {
    for (let [key, value] of Object.entries(props)) {
      if (!isSchemaObject(value)) {
        continue;
      }
      if (!has(value, "type")) {
        const schemaType = get(schemaProperties, [key, "type"]);
        newSchema = {
          ...newSchema,
          [key]: {
            ...value,
            type: schemaType
          }
        };
      }
    }
  }
  return {
    ...jsonSchema,
    [key]: {
      ...schema,
      properties: {
        ...schema.properties,
        ...newSchema
      }
    }
  };
};

/**
 * Update schema conditions(if, then, else) and properties with any required
 * or missing information
 */

export const mergeConditions = (jsonSchema: JSONSchema7): JSONSchema7 => {
  console.log("jsonSchema", JSON.stringify(jsonSchema));
  console.log("======================");

  // jsonSchema = {
  //   ...jsonSchema,
  //   properties: {
  //     ...jsonSchema.properties,
  //     tin: {
  //       type: "string"
  //     },
  //     tinUnavailableReason: {
  //       type: "string"
  //     },
  //     tinUnavailableExplanation: {
  //       type: "string"
  //     }
  //   }
  // };

  let { if: ifs, then, else: elses, properties } = jsonSchema;

  if (!isSchemaObject(properties)) throw new Error();

  if (isSchemaObject(ifs)) {
    jsonSchema = sanitiseConditions(jsonSchema, ifs, "if");
  }

  if (isSchemaObject(then)) {
    jsonSchema = sanitiseConditions(jsonSchema, then, "then");
    jsonSchema = addConditionToProperties(jsonSchema, then);
  }

  if (isSchemaObject(elses)) {
    jsonSchema = sanitiseConditions(jsonSchema, elses, "else");
  }

  return jsonSchema;
};
