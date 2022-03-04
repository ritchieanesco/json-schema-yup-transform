import * as Yup from "yup";
import type { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() not", () => {
  it("should validate data types", () => {
    let schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          not: { type: "string", minLength: 6 }
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: "1234"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: "123456"
    });
    expect(valid).toBeFalsy();
  });
});
