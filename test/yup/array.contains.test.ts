import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema";
import convertToYup from "../../src";

describe("convertToYup() array contains", () => {
  it("should validate strings", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "string"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let valid;

    valid = yupschema.isValidSync({
      things: ["a", 1, {}]
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
      things: [1, null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [[], false]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [{}, 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [{}, 1] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field must at least contain one item of type string");
  });

  it("should validate numbers", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "number"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
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
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [null, false]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [null, false] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field must at least contain one item of type number");
  });

  it("should validate integers", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "integer"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
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
      things: [2, 2.36, 50.0]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [null, false]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [3.56, "a"]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [3.56, "a"] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field must at least contain one item of type integer");
  });

  it("should validate booleans", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "boolean"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
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
      things: ["A", null]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [[], 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: [[], 1] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field must at least contain one item of type boolean");
  });

  it("should validate objects", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "object"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
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
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["a", 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: ["a", 1] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field must at least contain one item of type object");
  });

  it("should validate array", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          contains: {
            type: "array"
          }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
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
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["a", 1]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ things: ["a", 1] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field must at least contain one item of type array");
  });
});
