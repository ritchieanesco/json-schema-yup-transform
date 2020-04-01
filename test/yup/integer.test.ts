import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() integer", () => {
  it("should validate integer type", () => {
    const schema: JSONSchema7 = {
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
});
