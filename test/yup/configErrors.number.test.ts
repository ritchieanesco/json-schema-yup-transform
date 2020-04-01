import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() number configuration errors", () => {
  it("should show configuration error for incorrect data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        age: {
          type: "number"
        }
      }
    };
    const config = {
      errors: {
        defaults: {
          number: "Default number message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ age: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.defaults.number);
  });

  it("should show configuration error for required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        age: {
          type: "number"
        }
      },
      required: ["age"]
    };
    const config = {
      errors: {
        age: {
          required: "Age (number) is required"
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
    expect(errorMessage).toBe(config.errors.age.required);
  });

  it("should show configuration error when value does not meet minimum number", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          minimum: 5
        }
      }
    };
    const config = {
      errors: {
        years: {
          minimum: "Does not meet minimum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 3 });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.years.minimum);
  });

  it("should show configuration error when value does not meet exclusive minimum number", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          exclusiveMinimum: 5
        }
      }
    };
    const config = {
      errors: {
        years: {
          exclusiveMinimum: "Does not meet exclusive minimum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 3 });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.years.exclusiveMinimum);
  });

  it("should show configuration error when value does not meet maximum number", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          maximum: 5
        }
      }
    };
    const config = {
      errors: {
        years: {
          maximum: "Does not meet maximum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.years.maximum);
  });

  it("should show configuration error when value does not meet exclusive maximum number", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          exclusiveMaximum: 5
        }
      }
    };
    const config = {
      errors: {
        years: {
          exclusiveMaximum: "Does not meet exclusive maximum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.years.exclusiveMaximum);
  });

  it("should show configuration error when value does not match multiple of", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          multipleOf: 5
        }
      }
    };
    const config = {
      errors: {
        years: {
          multipleOf: "Value is not multiple of 5"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.years.multipleOf);
  });

  it("should show configuration error when value does not match constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          const: 5
        }
      }
    };
    const config = {
      errors: {
        years: {
          const: "Value does not match 5"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.years.const);
  });

  it("should show configuration error when value does not match one of enums", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          enum: [5, 9]
        }
      }
    };
    const config = {
      errors: {
        years: {
          enum: "Value does not match 5 or 9"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.years.enum);
  });
});
