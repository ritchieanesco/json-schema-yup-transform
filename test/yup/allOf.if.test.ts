import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

// Note: Unit tests cover the core functionality. Formats have been excluded
// as all those validators use the pattern method

describe("convertToYup() string conditions", () => {
  it("should validate single if statement in allOf", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        }
      },
      required: ["country"],
      allOf: [
        {
          if: {
            properties: { country: { type: "string", const: "Australia" } }
          },
          then: {
            properties: {
              postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
            },
            required: ["postal_code"]
          }
        }
      ]
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Australia"
    });
    expect(isValid).toBeFalsy();
  });
  it("should ignore non-relevant if statements in allOf", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        }
      },
      required: ["country"],
      allOf: [
        {
          if: {
            properties: { country: { type: "string", const: "Canada" } }
          },
          then: {
            properties: {
              postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
            },
            required: ["postal_code"]
          }
        }
      ]
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Australia"
    });
    expect(isValid).toBeTruthy();
  });
  it("should validate multiple if statement in allOf", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        },
        isMinor: {
          type: "boolean"
        }
      },
      required: ["country", "isMinor"],
      allOf: [
        {
          if: {
            properties: { isMinor: { type: "boolean", const: true } }
          },
          then: {
            properties: { hasParentConsent: { type: "boolean" } },
            required: ["hasParentConsent"]
          }
        },
        {
          if: {
            properties: { country: { type: "string", const: "Australia" } }
          },
          then: {
            properties: {
              postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
            },
            required: ["postal_code"]
          }
        }
      ]
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    const notValid1 = yupschema.isValidSync({
      country: "Canada",
      isMinor: true
    });
    expect(notValid1).toBeFalsy();

    const notValid2 = yupschema.isValidSync({
      country: "Australia",
      isMinor: false
    });
    expect(notValid2).toBeFalsy();

    const notValid3 = yupschema.isValidSync({
      country: "Australia",
      isMinor: true
    });
    expect(notValid3).toBeFalsy();

    const notValid4 = yupschema.isValidSync({
      country: "Australia",
      isMinor: true,
      postal_code: "12345"
    });
    expect(notValid4).toBeFalsy();

    const notValid5 = yupschema.isValidSync({
      country: "Australia",
      isMinor: true,
      hasParentConsent: true
    });
    expect(notValid5).toBeFalsy();

    const isValid1 = yupschema.isValidSync({
      country: "Australia",
      isMinor: false,
      postal_code: "12345"
    });
    expect(isValid1).toBeTruthy();

    const isValid2 = yupschema.isValidSync({
      country: "Australia",
      isMinor: true,
      postal_code: "12345",
      hasParentConsent: true
    });
    expect(isValid2).toBeTruthy();
  });
  it("should validate deep schema", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: {
        location: {
          $id: "/definitions/location",
          $schema: "https://json-schema.org/draft/2020-12/schema",
          type: "object",
          properties: {
            country: {
              type: "string",
              enum: ["Australia", "Canada"]
            }
          },
          required: ["country"],
          allOf: [
            {
              if: {
                properties: { country: { type: "string", const: "Australia" } }
              },
              then: {
                properties: {
                  postal_code: {
                    type: "string",
                    pattern: "[0-9]{5}(-[0-9]{4})?"
                  }
                },
                required: ["postal_code"]
              }
            }
          ]
        }
      },
      properties: {
        location: {
          description: "",
          $ref: "#/definitions/location"
        }
      },
      required: ["location"]
    };

    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    const isValid = yupschema.isValidSync({
      location: {
        country: "Australia",
        isMinor: true,
        postal_code: "12345",
        hasParentConsent: true
      }
    });
    expect(isValid).toBeTruthy();

    const isInvalid = yupschema.isValidSync({
      location: {
        country: "Australia"
      }
    });
    expect(isInvalid).toBeFalsy();
  });
});
