import * as Yup from "yup";
import type { JSONSchema7 } from "json-schema";
import isEqual from "lodash/isEqual";
import convertToYup from "../../src";

describe("convertToYup() array items", () => {
  it("should validate definitions", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: {
        country: {
          type: "object",
          properties: {
            country: {
              type: "string",
              minLength: 1,
              maxLength: 30,
              description: "The country of the resident"
            },
            hasID: {
              type: "string",
              minLength: 1,
              maxLength: 8
            }
          },
          required: ["country", "hasID"]
        }
      },
      properties: {
        countries: {
          type: "array",
          items: {
            $ref: "#/definitions/country"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      countries: [
        {
          country: "Singapore",
          hasID: "true"
        }
      ]
    });
    expect(valid).toBeTruthy();
  });

  it("should validate strings", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: {
            type: "string"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["a"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["1"]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["a", null]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate unique strings", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          uniqueItems: true,
          items: {
            type: "string"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["a", "b"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["a", "a"]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();
  });

  it("should validate numbers", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: {
            type: "number"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [1]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [2, null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [3, false]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate integers", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: {
            type: "integer"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [1]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [2, null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [3, false]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [3.56, 1]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate booleans", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: {
            type: "boolean"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [true]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [false, null]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate objects", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: {
            type: "object"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [{}]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [{ s: "1" }, null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [{ s: "1" }, 1]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate array", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: {
            type: "array"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [[]]
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      things: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [["a"], null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [[{ s: "1" }], 1]
    });
    expect(valid).toBeFalsy();
  });
  it("should set default value", () => {
    const defaultValue = ["a"];
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array",
          default: defaultValue
        }
      },
      required: ["list"]
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema
      .test("is-default", "${path} is default value", (value) =>
        isEqual(value.list, defaultValue)
      )
      .isValidSync({});

    expect(isValid).toBeTruthy();
  });
});
