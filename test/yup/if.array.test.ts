import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() array conditions", () => {
  it("should validate all fields with exception to conditional fields", () => {
    const schema: JSONSchema7 = {
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
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      list: ["a", "b", "c"]
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional when dependency matches minimum items", () => {
    const schema: JSONSchema7 = {
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
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

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
    const schema: JSONSchema7 = {
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
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

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
    const schema: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "crs",
      description: "CRS",
      type: "object",
      properties: {
        isTaxResidentOnly: {
          type: "string"
        }
      },
      required: ["isTaxResidentOnly"],
      if: {
        properties: {
          isTaxResidentOnly: {
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
                country: {
                  type: "string",
                  description: "The country of the resident"
                },
                hasID: {
                  type: "string"
                }
              },
              required: ["country", "hasID"]
            },
            minItems: 1,
            maxItems: 5
          }
        },
        required: ["countries"]
      }
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isTaxResidentOnly: "true",
      countries: [
        {
          country: "Singapore",
          idReason: "",
          idNoExplanation: ""
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          idReason: "",
          idNoExplanation: "",
          hasID: "asdasdasd"
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          idReason: "",
          idNoExplanation: ""
        }
      ]
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate $ref items", () => {
    const schema: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "crs",
      description: "CRS",
      type: "object",
      definitions: {
        country: {
          type: "object",
          properties: {
            country: {
              type: "string"
            },
            hasID: {
              type: "string"
            }
          },
          required: ["country", "hasID"]
        }
      },
      properties: {
        isTaxResidentOnly: {
          type: "string"
        }
      },
      required: ["isTaxResidentOnly"],
      if: {
        properties: {
          isTaxResidentOnly: {
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

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isTaxResidentOnly: "true",
      countries: [
        {
          country: "Singapore"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "true"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          hasID: "TEST"
        }
      ]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          hasID: "TEST"
        },
        {
          country: "Singapore",
          hasID: "TEST"
        },
        {
          country: "Singapore",
          hasID: "TEST"
        },
        {
          country: "Singapore",
          hasID: "TEST"
        },
        {
          country: "Singapore",
          hasID: "TEST"
        },
        {
          country: "Singapore",
          hasID: "TEST"
        }
      ]
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: []
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore"
        }
      ]
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate nested conditions", () => {
    const schema: JSONSchema7 = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "crs",
      description: "CRS",
      type: "object",
      definitions: {
        country: {
          type: "object",
          properties: {
            country: {
              type: "string",
              minLength: 1,
              maxLength: 30
            },
            hasID: {
              type: "string",
              minLength: 1,
              maxLength: 8
            }
          },
          required: ["country", "hasID"],
          if: {
            properties: {
              hasID: {
                const: "true"
              }
            }
          },
          then: {
            properties: {
              id: {
                type: "string",
                minLength: 1,
                maxLength: 8
              }
            },
            required: ["id"]
          },
          else: {
            properties: {
              idReason: {
                type: "string",
                minLength: 1,
                maxLength: 50
              }
            },
            required: ["idReason"],
            if: {
              properties: {
                idReason: {
                  const: "UNOBTAINABLE"
                }
              }
            },
            then: {
              properties: {
                idNoExplanation: {
                  type: "string",
                  minLength: 1,
                  maxLength: 8
                }
              },
              required: ["idNoExplanation"]
            }
          }
        }
      },
      properties: {
        isTaxResidentOnly: {
          type: "string"
        }
      },
      required: ["isTaxResidentOnly"],
      if: {
        properties: {
          isTaxResidentOnly: {
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

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          hasID: "true",
          id: "TEST"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          hasID: "false",
          idReason: "TEST"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          hasID: "false"
        }
      ]
    });

    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          hasID: "false",
          idReason: "UNOBTAINABLE"
        }
      ]
    });

    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      isTaxResidentOnly: "false",
      countries: [
        {
          country: "Singapore",
          hasID: "false",
          idReason: "UNOBTAINABLE",
          idNoExplanation: "TEST"
        }
      ]
    });

    expect(isValid).toBeTruthy();
  });
});
