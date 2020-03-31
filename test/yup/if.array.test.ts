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
        properties: { list: { minItems: 3, type: "array" } }
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
        properties: { list: { minItems: 3, type: "array" } }
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
    expect(isValid).toBeTruthy();
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
        properties: { list: { maxItems: 3, type: "array" } }
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
    expect(isValid).toBeTruthy();
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
            type: "string",
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
              type: "string"
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
            type: "string",
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
          taxResidentCountry: "Singapore"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "true"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          hasTin: "TEST"
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          hasTin: "TEST"
        },
        {
          taxResidentCountry: "Singapore",
          hasTin: "TEST"
        },
        {
          taxResidentCountry: "Singapore",
          hasTin: "TEST"
        },
        {
          taxResidentCountry: "Singapore",
          hasTin: "TEST"
        },
        {
          taxResidentCountry: "Singapore",
          hasTin: "TEST"
        },
        {
          taxResidentCountry: "Singapore",
          hasTin: "TEST"
        }
      ]
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: []
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore"
        }
      ]
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate nested conditions", () => {
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
              minLength: 1,
              maxLength: 30,
              description: "The country of the resident"
            },
            hasTin: {
              type: "string",
              minLength: 1,
              maxLength: 8
            }
          },
          required: ["taxResidentCountry", "hasTin"],
          if: {
            properties: {
              hasTin: {
                const: "true"
              }
            }
          },
          then: {
            properties: {
              tin: {
                type: "string",
                minLength: 1,
                maxLength: 8
              }
            },
            required: ["tin"]
          },
          else: {
            properties: {
              tinUnavailableReason: {
                type: "string",
                minLength: 1,
                maxLength: 50
              }
            },
            required: ["tinUnavailableReason"],
            if: {
              properties: {
                tinUnavailableReason: {
                  const: "Z-TIN UNOBTAINABLE"
                }
              }
            },
            then: {
              properties: {
                tinUnavailableExplanation: {
                  type: "string",
                  minLength: 1,
                  maxLength: 8
                }
              },
              required: ["tinUnavailableExplanation"]
            }
          }
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
            type: "string",
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
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          hasTin: "true",
          tin: "TEST"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          hasTin: "false",
          tinUnavailableReason: "TEST"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          hasTin: "false"
        }
      ]
    });

    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          hasTin: "false",
          tinUnavailableReason: "Z-TIN UNOBTAINABLE"
        }
      ]
    });

    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "Singapore",
          hasTin: "false",
          tinUnavailableReason: "Z-TIN UNOBTAINABLE",
          tinUnavailableExplanation: "TEST"
        }
      ]
    });

    expect(isValid).toBeTruthy();
  });
});
