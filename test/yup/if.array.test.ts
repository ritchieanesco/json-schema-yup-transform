import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema";
import convertToYup from "../../src";

describe("convertToYup() array conditions", () => {
  it("should validate all fields with exception to conditional fields", () => {
    const schema: JSONSchema = {
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
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      list: ["a", "b", "c"]
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional when dependency matches minimum items", () => {
    const schema: JSONSchema = {
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
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

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
    const schema: JSONSchema = {
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
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

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
    const schema: JSONSchema = {
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

    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
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
    const schema: JSONSchema = {
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

    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
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
    const schema: JSONSchema = {
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

    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    // let yupschema = Yup.object({
    //   isTaxResidentOnly: Yup.string().required(),
    //   countries: Yup.array().when("isTaxResidentOnly", {
    //     is: "false",
    //     then: Yup.array().min(1).max(5).of(Yup.object({
    //       country: Yup.string().min(1).max(30).required(),
    //       hasID: Yup.string().required(),
    //       id: Yup.string().when("hasID", {
    //         is: "true",
    //         then: Yup.string().min(1).max(8).required()
    //       }),
    //       idReason: Yup.string().when("hasID", {
    //         is: "false",
    //         then: Yup.string().min(1).max(150).required()
    //       }),
    //       idNoExplanation: Yup.string().when("idReason", {
    //         is: "UNOBTAINABLE",
    //         then: Yup.string().min(1).max(8).required()
    //       })
    //     }))
    //   })
    // })

    console.log(JSON.stringify(yupschema));

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

  it("should validate multiple types", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: ["array", "null"]
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      list: ["a"]
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      list: null
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      list: ""
    });
    expect(isValid).toBeTruthy();
  });
});
