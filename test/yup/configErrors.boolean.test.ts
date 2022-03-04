import * as Yup from "yup";
import type { JSONSchema7 } from "json-schema";
import type { Config } from "../../src";
import convertToYup from "../../src";

describe("convertToYup() boolean configuration errors", () => {
  it("should show configuration error for incorrect data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        termsConditions: {
          type: "boolean"
        }
      }
    };
    const config = {
      errors: {
        defaults: {
          boolean: "Default boolean message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ termsConditions: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.defaults.boolean);
  });

  it("should show configuration CUSTOM error for incorrect data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        termsConditions: {
          type: "boolean"
        }
      }
    };
    const config: Config = {
      errors: {
        defaults: {
          boolean: ([key]) => `${key} field is invalid`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ termsConditions: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("termsConditions field is invalid");
  });

  it("should show configuration error for required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        termsConditions: {
          type: "boolean"
        }
      },
      required: ["termsConditions"]
    };
    const config = {
      errors: {
        termsConditions: {
          required: "Terms and conditions (boolean) is required"
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
    expect(errorMessage).toBe(config.errors.termsConditions.required);
  });

  it("should show configuration CUSTOM error for required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        termsConditions: {
          type: "boolean"
        }
      },
      required: ["termsConditions"]
    };
    const config: Config = {
      errors: {
        termsConditions: {
          required: ([key, { required }]) =>
            `${key} field is invalid. It is listed as a required field: ${required}`
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
    expect(errorMessage).toBe(
      "termsConditions field is invalid. It is listed as a required field: termsConditions"
    );
  });

  it("should show configuration error when value does not match constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        isActive: {
          type: "boolean",
          const: true
        }
      }
    };
    const config = {
      errors: {
        isActive: {
          const: "Incorrect constant"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ isActive: false });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.isActive.const);
  });

  it("should show configuration CUSTOM error for constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        isActive: {
          type: "boolean",
          const: true
        }
      }
    };
    const config: Config = {
      errors: {
        isActive: {
          const: ([key, { const: consts }]) =>
            `${key} is invalid. Needs to match the constant ${consts}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ isActive: false });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "isActive is invalid. Needs to match the constant true"
    );
  });
});
