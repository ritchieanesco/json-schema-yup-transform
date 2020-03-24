import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() array", () => {
  it("should validate array type", () => {
    const schm: JSONSchema7 = {
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
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
    const schm: JSONSchema7 = {
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
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

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
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      items: ["a"]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({});
    expect(valid).toBeFalsy();
    try {
      valid = yupschema.validateSync({});
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("This is required");
  });

  it("should validate minItems", () => {
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

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
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Minimum of 3 items required");
  });

  it("should validate maxItems", () => {
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let valid;

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
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Maximum of 6 items required");
  });
});
