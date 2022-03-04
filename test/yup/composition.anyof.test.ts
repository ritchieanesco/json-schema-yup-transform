import * as Yup from "yup";
import type { JSONSchema7 } from "json-schema";
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
            { type: "string", const: "test" }
          ]
        }
      },
      required: ["things"]
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

    valid = yupschema.isValidSync({});
    expect(valid).toBeFalsy();
  });

  it("should validate fields using definition", () => {
    let schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: {
        person: {
          type: "object",
          properties: {
            personName: { type: "string" }
          },
          required: ["personName"]
        },
        company: {
          type: "object",
          properties: {
            companyName: { type: "string" }
          },
          required: ["companyName"]
        }
      },
      properties: {
        entity: {
          anyOf: [
            { $ref: "#/definitions/person" },
            { $ref: "#/definitions/company" }
          ]
        }
      },
      required: ["entity"]
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
        things: "lol"
      }
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      entity: undefined
    });
    expect(valid).toBeFalsy();
  });
});
