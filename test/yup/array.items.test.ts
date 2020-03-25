import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import isEqual from "lodash/isEqual";
import convertToYup from "../../src";

describe("convertToYup() array items", () => {
  it("should validate strings", () => {
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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

  it("should validate numbers", () => {
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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

  it("should validate tuples", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "string",
              const: "test"
            },
            { type: "number", enum: [1, 2] },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["test", 1, true]
    });
    expect(valid).toBeTruthy();
  });

  it("should set default value", () => {
    const defaults = ["a"];
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array",
          default: defaults
        }
      },
      required: ["list"]
    };

    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({});
    expect(isValid).toBeTruthy();

    let field = Yup.reach(yupschema, "list");
    // @ts-ignore
    expect(isEqual(field._default, defaults)).toBeTruthy();
  });
});
