import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema"
import convertToYup from "../../src";

describe("convertToYup() array items tuple", () => {
  it("should validate data types", () => {
    let schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
            { type: "object" },
            { type: "array" },
            { type: "null" },
            { type: "integer" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["test", 1.5, true, { a: "1" }, ["test"], null, 5]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [null, 1.5, true, { a: "1" }, ["test"], null, 5]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: ["test", "1.5", true, { a: "1" }, ["test"], null, 5]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: ["test", 1.5, 1, { a: "1" }, ["test"], null, 5]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: ["test", 1.5, true, null, ["test"], null, 5]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: ["test", 1.5, true, { a: "1" }, "test", null, 5]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: ["test", 1.5, true, { a: "1" }, ["test"], "a", 5]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: ["test", 1.5, true, { a: "1" }, ["test"], null, 5.5]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate string const", () => {
    const schema: JSONSchema = {
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
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["test", 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["null", 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate number const", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "number",
              const: 0
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [0, 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [1, 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate integer const", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "integer",
              const: 8
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [8, 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [8.1, 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should NOT validate object const", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "object",
              const: "test"
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [{ a: "whwhwh" }, 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["null", 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate array const", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "array",
              const: ["test"]
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [["test"], 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["null", 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate string enum", () => {
    const schema: JSONSchema = {
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
              enum: ["test", "testB"]
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["test", 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["testB", 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["null", 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate number enum", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "number",
              enum: [1.5, 2]
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [1.5, 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [2, 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [3, 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate integer enum", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "integer",
              enum: [1, 2]
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [1, 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [2, 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [3, 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate array enum", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: "array",
              enum: [
                ["a", "b"],
                ["c", "d"]
              ]
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [["a", "b"], 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [["c", "d"], 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: [["e", "f"], 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should not validate multiple types", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          type: "array",
          items: [
            {
              type: ["string", "null"]
            }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: ["a"]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      things: [null]
    });
    expect(valid).toBeFalsy();
  });
});
