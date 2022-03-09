import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema"
import convertToYup from "../../src";

describe("convertToYup() allOf", () => {
  it("should validate data types", () => {
    let schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          allOf: [
            { type: "string", minLength: 4 },
            { type: "string", maxLength: 6 }
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let valid;

    valid = yupschema.isValidSync({
      things: "12345"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: "1234567"
    });
    expect(valid).toBeFalsy();
  });
});
