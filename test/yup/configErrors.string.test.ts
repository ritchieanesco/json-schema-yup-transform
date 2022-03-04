import * as Yup from "yup";
import type { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";
import type { Config } from "../../src";
import { JSONSchema7DefinitionExtended } from "../../src/schema";

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
    const config: Config = {
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
    expect(errorMessage).toBe("Default string message");
  });

  it("should show configuration CUSTOM error for default string type", () => {
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
    const config: Config = {
      errors: {
        defaults: {
          string: ([key]) => `${key} custom string error message`
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
    expect(errorMessage).toBe("name custom string error message");
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
    const config: Config = {
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
    expect(errorMessage).toBe("Name (string) is required");
  });

  it("should show configuration CUSTOM error for required", () => {
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
    const config: Config = {
      errors: {
        name: {
          required: ([key]) => `${key} custom required error message`
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
    expect(errorMessage).toBe("name custom required error message");
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
    const config: Config = {
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
    expect(errorMessage).toBe("Minimum character length error");
  });

  it("should show configuration CUSTOM error for minimum character length", () => {
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
    const config: Config = {
      errors: {
        name: {
          minLength: ([key, { title, minLength }]) =>
            `${key} custom minimum ${minLength} characters`
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
    expect(errorMessage).toBe("name custom minimum 6 characters");
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
    const config: Config = {
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
    expect(errorMessage).toBe("Maximum character length error");
  });

  it("should show configuration CUSTOM error for maximum character length", () => {
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
    const config: Config = {
      errors: {
        name: {
          maxLength: ([key, { maxLength }]) =>
            `${key} custom maximium ${maxLength} characters`
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
    expect(errorMessage).toBe("name custom maximium 6 characters");
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
    const config: Config = {
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
    expect(errorMessage).toBe("Incorrect pattern");
  });

  it("should show configuration CUSTOM error for pattern", () => {
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
    const config: Config = {
      errors: {
        postcode: {
          pattern: ([key, { pattern }]) => `${key} custom pattern ${pattern}`
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
    expect(errorMessage).toBe(
      "postcode custom pattern /^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/"
    );
  });

  it("should show configuration error when value does not match regex", () => {
    const schema: JSONSchema7DefinitionExtended = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "string",
          regex: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        }
      }
    };
    const config: Config = {
      errors: {
        postcode: {
          regex: "Incorrect regex"
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
    expect(errorMessage).toBe("Incorrect regex");
  });

  it("should show configuration CUSTOM error for regex", () => {
    const schema: JSONSchema7DefinitionExtended = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "string",
          regex: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        }
      }
    };
    const config: Config = {
      errors: {
        postcode: {
          regex: ([key, { regex }]) => `${key} custom regex ${regex}`
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
    expect(errorMessage).toBe(
      "postcode custom regex /^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$/"
    );
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
    const config: Config = {
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
    expect(errorMessage).toBe("Incorrect constant");
  });

  it("should show configuration CUSTOM error for constant", () => {
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
    const config: Config = {
      errors: {
        target: {
          const: ([key, { const: consts }]) => `${key} custom const ${consts}`
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
    expect(errorMessage).toBe("target custom const Test");
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
    const config: Config = {
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
    expect(errorMessage).toBe("Value does not match any of the enums");
  });

  it("should show configuration CUSTOM error for enum", () => {
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
    const config: Config = {
      errors: {
        target: {
          enum: ([key, { enum: enums }]) => `${key} custom enum ${enums}`
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
    expect(errorMessage).toBe("target custom enum TestA,TestB");
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
    const config: Config = {
      errors: {
        date: {
          format: "Value does not match date time format"
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
    expect(errorMessage).toBe("Value does not match date time format");
  });

  it("should show configuration CUSTOM error for date-time format", () => {
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
    const config: Config = {
      errors: {
        date: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("date field has invalid date-time format");
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
    const config: Config = {
      errors: {
        time: {
          format: "Value does not match time format"
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
    expect(errorMessage).toBe("Value does not match time format");
  });

  it("should show configuration CUSTOM error for match time format", () => {
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
    const config: Config = {
      errors: {
        time: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("time field has invalid time format");
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
    const config: Config = {
      errors: {
        date: {
          format: "Value does not match date format"
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
    expect(errorMessage).toBe("Value does not match date format");
  });

  it("should show configuration CUSTOM error for date format", () => {
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
    const config: Config = {
      errors: {
        date: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("date field has invalid date format");
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
    const config: Config = {
      errors: {
        email: {
          format: "Value does not match email format"
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
    expect(errorMessage).toBe("Value does not match email format");
  });

  it("should show configuration CUSTOM error for email format", () => {
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
    const config: Config = {
      errors: {
        email: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("email field has invalid email format");
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
    const config: Config = {
      errors: {
        email: {
          format: "Value does not match idn email format"
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
    expect(errorMessage).toBe("Value does not match idn email format");
  });

  it("should show configuration CUSTOM error for idn email format", () => {
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
    const config: Config = {
      errors: {
        email: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("email field has invalid idn-email format");
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
    const config: Config = {
      errors: {
        website: {
          format: "Value does not match hostname format"
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
    expect(errorMessage).toBe("Value does not match hostname format");
  });

  it("should show configuration CUSTOM error for hostname format", () => {
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
    const config: Config = {
      errors: {
        website: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("website field has invalid hostname format");
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
    const config: Config = {
      errors: {
        website: {
          format: "Value does not match idn hostname format"
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
    expect(errorMessage).toBe("Value does not match idn hostname format");
  });

  it("should show configuration CUSTOM error for hostname format", () => {
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
    const config: Config = {
      errors: {
        website: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("website field has invalid idn-hostname format");
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
    const config: Config = {
      errors: {
        ipAddress: {
          format: "Value does not match ipv4 format"
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
    expect(errorMessage).toBe("Value does not match ipv4 format");
  });

  it("should show configuration CUSTOM error for ipv4 format", () => {
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
    const config: Config = {
      errors: {
        ipAddress: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("ipAddress field has invalid ipv4 format");
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
    const config: Config = {
      errors: {
        ipAddress: {
          format: "Value does not match ipv6 format"
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
    expect(errorMessage).toBe("Value does not match ipv6 format");
  });

  it("should show configuration CUSTOM error for ipv6 format", () => {
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
    const config: Config = {
      errors: {
        ipAddress: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("ipAddress field has invalid ipv6 format");
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
    const config: Config = {
      errors: {
        website: {
          format: "Value does not match URI format"
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
    expect(errorMessage).toBe("Value does not match URI format");
  });

  it("should show configuration CUSTOM error for match URI format", () => {
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
    const config: Config = {
      errors: {
        website: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("website field has invalid uri format");
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
    const config: Config = {
      errors: {
        website: {
          format: "Value does not match URI reference format"
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
    expect(errorMessage).toBe("Value does not match URI reference format");
  });

  it("should show configuration CUSTOM error for URI relative path format", () => {
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
    const config: Config = {
      errors: {
        website: {
          format: ([key, { format }]) =>
            `${key} field has invalid ${format} format`
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
    expect(errorMessage).toBe("website field has invalid uri-reference format");
  });
});
