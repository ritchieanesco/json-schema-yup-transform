import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() string configuration errors", () => {
  it("should show configuration error for incorrect data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string"
        }
      }
    };
    const config = {
      errors: {
        defaults: {
          string: "Default string message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: null });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.defaults.string);
  });

  it("should show configuration error for required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string"
        }
      },
      required: ["name"]
    };
    const config = {
      errors: {
        name: {
          required: "Name (string) is required"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({});
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.name.required);
  });

  it("should show configuration error when value does not meet minimum character length", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          minLength: 6
        }
      },
      required: ["name"]
    };
    const config = {
      errors: {
        name: {
          minLength: "Minimum character length error"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: "abc" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.name.minLength);
  });

  it("should show configuration error when value does not meet maximum character length", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string",
          maxLength: 6
        }
      }
    };
    const config = {
      errors: {
        name: {
          maxLength: "Maximum character length error"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ name: "abcdefg" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.name.maxLength);
  });

  it("should show configuration error when value does not match pattern", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "string",
          pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        }
      }
    };
    const config = {
      errors: {
        postcode: {
          pattern: "Incorrect pattern"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ postcode: "abcdefg" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.postcode.pattern);
  });

  it("should show configuration error when value does not match constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        target: {
          type: "string",
          const: "Test"
        }
      }
    };
    const config = {
      errors: {
        target: {
          const: "Incorrect constant"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ target: "abcdefg" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.target.const);
  });

  it("should show configuration error when value does not match enum", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        target: {
          type: "string",
          enum: ["TestA", "TestB"]
        }
      }
    };
    const config = {
      errors: {
        target: {
          enum: "Value does not match any of the enums"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ target: "abcdefg" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.target.enum);
  });

  it("should show configuration error when value does not match date-time format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        date: {
          type: "string",
          format: "date-time"
        }
      }
    };
    const config = {
      errors: {
        date: {
          format: {
            dateTime: "Value does not match date time format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ date: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.date.format.dateTime);
  });

  it("should show configuration error when value does not match time format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        time: {
          type: "string",
          format: "time"
        }
      }
    };
    const config = {
      errors: {
        time: {
          format: {
            time: "Value does not match time format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ time: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.time.format.time);
  });

  it("should show configuration error when value does not match date format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        date: {
          type: "string",
          format: "date"
        }
      }
    };
    const config = {
      errors: {
        date: {
          format: {
            date: "Value does not match date format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ date: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.date.format.date);
  });

  it("should show configuration error when value does not match email format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        email: {
          type: "string",
          format: "email"
        }
      }
    };
    const config = {
      errors: {
        email: {
          format: {
            email: "Value does not match email format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ email: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.email.format.email);
  });

  it("should show configuration error when value does not match idn email format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        email: {
          type: "string",
          format: "idn-email"
        }
      }
    };
    const config = {
      errors: {
        email: {
          format: {
            idnEmail: "Value does not match idn email format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ email: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.email.format.idnEmail);
  });

  it("should show configuration error when value does not match hostname format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "hostname"
        }
      }
    };
    const config = {
      errors: {
        website: {
          format: {
            hostname: "Value does not match hostname format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.website.format.hostname);
  });

  it("should show configuration error when value does not match international hostname format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "idn-hostname"
        }
      }
    };
    const config = {
      errors: {
        website: {
          format: {
            idnHostname: "Value does not match idn hostname format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.website.format.idnHostname);
  });

  it("should show configuration error when value does not match ipv4 format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        ipAddress: {
          type: "string",
          format: "ipv4"
        }
      }
    };
    const config = {
      errors: {
        ipAddress: {
          format: {
            ipv4: "Value does not match ipv4 format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ ipAddress: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.ipAddress.format.ipv4);
  });

  it("should show configuration error when value does not match ipv6 format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        ipAddress: {
          type: "string",
          format: "ipv6"
        }
      }
    };
    const config = {
      errors: {
        ipAddress: {
          format: {
            ipv6: "Value does not match ipv6 format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ ipAddress: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.ipAddress.format.ipv6);
  });

  it("should show configuration error when value does not match URI format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "uri"
        }
      }
    };
    const config = {
      errors: {
        website: {
          format: {
            uri: "Value does not match URI format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "Test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.website.format.uri);
  });

  it("should show configuration error when value does not match URI relative path format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "uri-reference"
        }
      }
    };
    const config = {
      errors: {
        website: {
          format: {
            uriReference: "Value does not match URI reference format"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "http://" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.website.format.uriReference);
  });
});
