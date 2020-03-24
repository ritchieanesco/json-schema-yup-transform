import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() boolean", () => {
  it("should validate boolean type", () => {
    const schm: JSONSchema7 = {
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
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

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
    const schm: JSONSchema7 = {
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
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

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
    const schm: JSONSchema7 = {
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
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
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
    expect(valid).toBe("This is required");
  });

  it("should set default value", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        consent: {
          type: "boolean",
          default: true
        }
      },
      required: ["consent"]
    };

    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({});
    expect(isValid).toBeTruthy();

    let field = Yup.reach(yupschema, "consent");
    // @ts-ignore
    expect(field._default).toBe(true);
  });
});
