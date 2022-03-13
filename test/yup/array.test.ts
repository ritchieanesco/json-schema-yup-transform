import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema";
import convertToYup from "../../src";

describe("convertToYup() array", () => {
  it("should validate array type", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "array"
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let isValid = yupschema.isValidSync({
      items: []
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: [1, 2]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: ["a", "b"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: { a: "a" }
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      items: "test123"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate multiple types", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: ["array", "null"]
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      items: ["a", "b"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: null
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate required", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "array"
        }
      },
      required: ["items"]
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let valid;

    valid = yupschema.isValidSync({
      items: ["a"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({});
    expect(valid).toBeFalsy();
    try {
      valid = yupschema.validateSync({});
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field is required");
  });

  it("should validate minItems", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "array",
          minItems: 3
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let valid;

    valid = yupschema.isValidSync({});
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: ["a", "b", "c"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: ["a", "b"]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ items: ["a", "b"] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field requires a minimum of 3 items");
  });

  it("should validate maxItems", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "array",
          maxItems: 6
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let valid;

    valid = yupschema.isValidSync({});
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: ["a", "b", "c"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: ["a", "b", "c", "d", "e", "f", "g"]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({
        items: ["a", "b", "c", "d", "e", "f", "g"]
      });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field cannot exceed a maximum of 6 items");
  });

  it("should validate constant", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array",
          const: ["a", "b"]
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      list: ["a", "b"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      list: ["a"]
    });
    expect(isValid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ list: ["b"] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("This field does not match constant");
  });

  it("should validate enum", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array",
          enum: [
            ["a", "b"],
            ["c", "d"]
          ]
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      list: ["a", "b"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      list: ["a"]
    });
    expect(isValid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ list: ["b"] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("This field does not match any of the enumerables");
  });

  it("should validate unique items", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "array",
          uniqueItems: true
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let valid;

    valid = yupschema.isValidSync({
      items: ["a", "b", "c"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: [{ a: 1 }, { b: 2 }, { c: 3 }]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: [["a"], ["b"], ["c"]]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: [{ a: 1 }, { b: 2 }, { b: 2 }]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      items: ["a", "b", "b"]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      items: [1, 2, 2]
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      items: [["a"], ["b"], ["b"]]
    });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ items: ["b", "b"] });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) valid = e.errors[0];
    }
    expect(valid).toBe("This field do not have unique values");
  });

  it("should not validate unique items", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "array",
          uniqueItems: false
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let valid;

    valid = yupschema.isValidSync({
      items: ["a", "b", "c"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: []
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: ["a", "b", "b"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      items: [1, 2, 2]
    });
    expect(valid).toBeTruthy();
  });
});
