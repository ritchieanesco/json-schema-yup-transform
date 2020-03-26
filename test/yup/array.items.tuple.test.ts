import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() array items tuple", () => {
  it("should validate data types", () => {
    let schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
            { type: "number" },
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

    valid = yupschema.isValidSync({
      things: ["null", 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate number const", () => {
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
              type: "number",
              const: 0
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
              type: "integer",
              const: 8
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
              type: "object",
              const: "test"
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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

  it("should NOT validate array const", () => {
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
              type: "array",
              const: "test"
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: [["asdadad"], 1, true]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: ["null", 1, true]
    });
    expect(valid).toBeFalsy();
  });

  it("should validate string enum", () => {
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
              enum: ["test", "testB"]
            },
            { type: "number" },
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
              type: "number",
              enum: [1.5, 2]
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
              type: "integer",
              enum: [1, 2]
            },
            { type: "number" },
            { type: "boolean" }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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

  it("should not validate multiple types", () => {
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
              type: ["string", "null"]
            }
          ]
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
