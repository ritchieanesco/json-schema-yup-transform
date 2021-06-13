import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() anyOf", () => {
  it("should validate data types", () => {
    let schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          anyOf: [
            { type: "string", minLength: 6 },
            { type: "string", const: "test" },
          ]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      things: "test"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: "allowed"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      things: "fail"
    });
    expect(valid).toBeFalsy();
  });
});
