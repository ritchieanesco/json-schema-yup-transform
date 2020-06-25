import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

// Note: Unit tests cover the core functionality. Formats have been excluded
// as all those validators use the pattern method

describe("convertToYup() string conditions", () => {
  it("should continue to validate fields with empty else schema", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      },
      else: {
        properties: {}
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada"
    });
    expect(isValid).toBeTruthy();
  });

  it("should continue to validate fields with empty then schema", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {}
      },
      else: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada"
    });
    expect(isValid).toBeTruthy();
  });

  it("should ignore then and else schema when if schema is missing", () => {
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
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      },
      else: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada"
    });
    expect(isValid).toBeTruthy();
  });

  it("should continue to validate fields with empty if schema", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {}
      },
      else: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada"
    });
    expect(isValid).toBeTruthy();
  });

  it("should use property type if condition type is unavailable", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada"
    });
    expect(isValid).toBeTruthy();
  });
  it("should validate all fields with exception to conditional fields", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: ["a"]
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional pattern when dependency matches constant", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "AAA"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "AAA"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional pattern when dependency matches enum", () => {
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
      if: {
        properties: { country: { type: "string", enum: ["Australia"] } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "AAA"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "AAA"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional pattern when dependency matches pattern", () => {
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
      if: {
        properties: { country: { type: "string", pattern: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "AAA"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional pattern when dependency matches minimum character length", () => {
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
      if: {
        properties: { country: { type: "string", minLength: 7 } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "AAA"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "AAA"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional pattern when dependency matches maximum character length", () => {
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
      if: {
        properties: { country: { type: "string", minLength: 6 } }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "AAA"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate required conditional", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string"
        }
      },
      required: ["country"],
      if: {
        properties: { country: { type: "string", const: "Canada" } }
      },
      then: {
        properties: {
          postal_code: { type: "string" }
        },
        required: ["postal_code"]
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Canada"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional constant when dependency matches constant", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", const: "12345" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "12345"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "AAA"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional enum when dependency matches constant", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", enum: ["12345", "67890"] }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "12345"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "67890"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "AAA"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional minimum character length when dependency matches constant", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", minLength: 8 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "00000000"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "0000"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional maximum character length when dependency matches constant", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", maxLength: 8 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "0000"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "000000000"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate other conditional", () => {
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
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", maxLength: 8 }
        }
      },
      else: {
        properties: {
          postal_code: { type: "string", maxLength: 4 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "205"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Canada",
      postal_code: "20500"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      country: "Australia"
    });
    expect(isValid).toBeTruthy();
  });

  fit("should validate required field", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string"
        },
        postal_code: { type: "string" }
      },
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string" }
        },
        required: ["postal_code"]
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      country: "Australia",
      postal_code: "0000"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      country: "Australia"
    });
    expect(isValid).toBeFalsy();
  });
});
