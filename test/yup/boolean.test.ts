import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() boolean", () => {
  it("should validate boolean type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        enable: {
          type: "boolean"
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      enable: true
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      enable: false
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      enable: null
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      enable: {}
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate multiple types", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        terms: {
          type: ["boolean", "null"]
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      terms: true
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      terms: null
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        enable: {
          type: "boolean"
        }
      },
      required: ["enable"]
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      enable: true
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({});
    expect(valid).toBeFalsy();
    try {
      valid = yupschema.validateSync({});
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Enable is required");
  });

  it("should set default value", () => {
    const defaultValue = true;
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        consent: {
          type: "boolean",
          default: defaultValue
        }
      },
      required: ["consent"]
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema
      .test(
        "is-default",
        "${path} is default value",
        (value) => value.consent === defaultValue
      )
      .isValidSync({});

    expect(isValid).toBeTruthy();
  });

  it("should validate constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        isActive: {
          type: "boolean",
          const: true
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      isActive: true
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isActive: false
    });
    expect(isValid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ isActive: false });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Isactive does not match constant");
  });
});
