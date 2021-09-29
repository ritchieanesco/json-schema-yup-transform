import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() oneOf", () => {
  it("should validate data types", () => {
    let schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        things: {
          oneOf: [
            { type: "string", minLength: 6 },
            { type: "string", minLength: 3 }
          ]
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

  it("should validate fields using definition id", () => {
    let schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: {
        person: {
          $id: "#person",
          type: "object",
          properties: {
            personName: { type: "string" }
          },
          required: ["personName"]
        },
        company: {
          $id: "#company",
          type: "object",
          properties: {
            companyName: { type: "string" }
          },
          required: ["companyName"]
        }
      },
      properties: {
        entity: {
          anyOf: [{ $ref: "#person" }, { $ref: "#company" }]
        }
      }
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      entity: {
        personName: "jane doe"
      }
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      entity: {
        companyName: "things incorporated"
      }
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      entity: {
        things: "fail"
      }
    });

    expect(valid).toBeFalsy();
  });
});
