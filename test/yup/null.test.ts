import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() null", () => {
  it("should allow null values", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "null"
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      name: null
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: ""
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: 0
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: false
    });
    expect(isValid).toBeTruthy();
  });
});
