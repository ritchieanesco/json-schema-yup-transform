import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() array conditions", () => {
  it("should validate all fields with exception to conditional fields", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array"
        }
      },
      required: ["list"],
      if: {
        properties: { list: { minItems: 3 } }
      },
      then: {
        properties: {
          otherList: { type: "array" }
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      list: ["a", "b", "c"]
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional when dependency matches minimum items", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array"
        }
      },
      required: ["list"],
      if: {
        properties: { list: { minItems: 3 } }
      },
      then: {
        properties: {
          otherList: { type: "array" }
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      list: ["a", "b", "c"],
      otherList: ["d"]
    });
    expect(isValid).toBeTruthy();

    yupschema.isValidSync({
      list: ["a", "b"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      list: ["a", "b", "c"],
      otherList: "A"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      list: ["a", "b"],
      otherList: "A"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional when dependency matches maximum items", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array"
        }
      },
      required: ["list"],
      if: {
        properties: { list: { maxItems: 3 } }
      },
      then: {
        properties: {
          otherList: { type: "array" }
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      list: ["a", "b", "c"],
      otherList: ["d"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      list: ["a", "b", "c", "d"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      list: ["a", "b", "c"],
      otherList: "A"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      list: ["a", "b", "c", "d", "e"],
      otherList: "A"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate an item of objects", () => {
    const schm: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "crs",
      description: "CRS",
      type: "object",
      properties: {
        isAustralianTaxResidentOnly: {
          type: "string"
        }
      },
      required: ["isAustralianTaxResidentOnly"],
      if: {
        properties: {
          isAustralianTaxResidentOnly: {
            const: "false"
          }
        }
      },
      then: {
        properties: {
          countries: {
            type: "array",
            items: {
              type: "object",
              properties: {
                taxResidentCountry: {
                  type: "string",
                  description: "The country of the resident"
                },
                hasTin: {
                  type: "string"
                }
              },
              required: ["taxResidentCountry", "hasTin"]
            },
            minItems: 1,
            maxItems: 5
          }
        },
        required: ["countries"]
      }
    };

    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "true",
      countries: [
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: ""
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: ""
        }
      ]
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate $ref items", () => {
    const schm: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "crs",
      description: "CRS",
      type: "object",
      definitions: {
        country: {
          type: "object",
          properties: {
            taxResidentCountry: {
              type: "string",
              description: "The country of the resident"
            },
            hasTin: {
              type: "string"
            }
          },
          required: ["taxResidentCountry", "hasTin"]
        }
      },
      properties: {
        isAustralianTaxResidentOnly: {
          type: "string"
        }
      },
      required: ["isAustralianTaxResidentOnly"],
      if: {
        properties: {
          isAustralianTaxResidentOnly: {
            const: "false"
          }
        }
      },
      then: {
        properties: {
          countries: {
            type: "array",
            items: {
              $ref: "#/definitions/country"
            },
            minItems: 1,
            maxItems: 5
          }
        },
        required: ["countries"]
      }
    };

    let yupschema = convertToYup(schm) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "true",
      countries: [
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: ""
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        },
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        },
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        },
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        },
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        },
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: "",
          hasTin: "asdasdasd"
        }
      ]
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          tinUnavailableReason: "",
          tinUnavailableExplanation: ""
        }
      ]
    });
    expect(isValid).toBeFalsy();
  });
});
