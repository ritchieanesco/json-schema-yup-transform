import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema"
import convertToYup from "../../src";

describe("convertToYup() integer", () => {
  it("should validate integer type", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        phone: {
          type: "integer"
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      phone: 123
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      phone: "123"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      phone: 123.16
    });
    expect(isValid).toBeFalsy();
  });

  it("should use title as label in error message", () => {
    const fieldTitle = "Phone Number";
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        phone: {
          type: "integer",
          title: fieldTitle
        }
      }
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ phone: "phone" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(`${fieldTitle} is not of type integer`);
  });
});
