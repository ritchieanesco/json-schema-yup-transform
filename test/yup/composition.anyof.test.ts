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
            { type: "string", const: "test" }
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
        entities: {
          anyOf: [{ $ref: "#person" }, { $ref: "#company" }]
        }
      }
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      entities: [
        {
          personName: "jane doe"
        }
      ]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      entities: [
        {
          companyName: "things incorporated"
        }
      ]
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      entities: [
        {
          personName: "jane doe"
        },
        {
          companyName: "things incorporated"
        }
      ]
    });

    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      entities: [
        {
          things: "fail"
        }
      ]
    });

    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      entities: [
        {
          companyName: "things incorporated"
        },
        {
          things: "fail"
        }
      ]
    });

    expect(valid).toBeFalsy();
  });
});
