import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() array configuration errors", () => {
  it("should show default configuration error for incorrect data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array"
        }
      }
    };
    const config = {
      errors: {
        defaults: {
          array: "Default array message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ groceries: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.defaults.array);
  });

  it("should show custom configuration error for incorrect data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array"
        }
      }
    };
    const config = {
      errors: {
        groceries: {
          array: "Default array message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ groceries: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.groceries.array);
  });

  it("should override defaults configuration error for incorrect data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array"
        }
      }
    };
    const config = {
      errors: {
        defaults: {
          array: "Default array message"
        },
        groceries: {
          array: "Custom array message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ groceries: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.groceries.array);
  });

  it("should show defaults configuration error for required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array"
        }
      },
      required: ["groceries"]
    };
    const config = {
      errors: {
        defaults: {
          required: "Field is required"
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
    expect(errorMessage).toBe(config.errors.defaults.required);
  });

  it("should show custom configuration error for required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array"
        }
      },
      required: ["groceries"]
    };
    const config = {
      errors: {
        groceries: {
          required: "Groceries (array) is required"
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
    expect(errorMessage).toBe(config.errors.groceries.required);
  });

  it("should override defaults configuration error for required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array"
        }
      },
      required: ["groceries"]
    };
    const config = {
      errors: {
        defaults: {
          required: "Field is required"
        },
        groceries: {
          required: "Groceries (array) is required"
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
    expect(errorMessage).toBe(config.errors.groceries.required);
  });

  it("should show configuration error for minimum required items", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array",
          minItems: 3
        }
      }
    };
    const config = {
      errors: {
        groceries: {
          minItems: "A minimum item of 3 is required"
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
    expect(errorMessage).toBe(config.errors.groceries.minItems);
  });

  it("should show configuration error for maximum required items", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array",
          maxItems: 3
        }
      }
    };
    const config = {
      errors: {
        groceries: {
          maxItems: "A maximum item of 3 is required"
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
    expect(errorMessage).toBe(config.errors.groceries.maxItems);
  });

  it("should show configuration error when at least one value does not match data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array",
          contains: {
            type: "string"
          }
        }
      }
    };
    const config = {
      errors: {
        groceries: {
          contains: "At least one value should be of type string"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ groceries: [null] });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.groceries.contains);
  });

  it("should show configuration error when all values do not match data type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array",
          items: {
            type: "string"
          }
        }
      }
    };
    const config = {
      errors: {
        defaults: {
          string: "All values should be of type string"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ groceries: [null] });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.defaults.string);
  });

  it("should show configuration error when tuple does not match", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        groceries: {
          type: "array",
          items: [{ type: "string" }]
        }
      }
    };
    const config = {
      errors: {
        groceries: {
          tuple: "Value does not match expected type"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ groceries: [null] });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.groceries.tuple);
  });

  it("should show configuration error for nested field", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        countries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              country: {
                type: "string",
                minLength: 1,
                maxLength: 5
              },
              hasID: {
                type: "string",
                minLength: 1,
                maxLength: 8
              }
            }
          }
        }
      }
    };
    const config = {
      errors: {
        countries: {
          country: {
            maxLength: "Country is required"
          }
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({
        countries: [{ country: "Singapore" }]
      });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.countries.country.maxLength);
  });

  it("should show configuration error when value does not match constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array",
          const: ["a", "b"]
        }
      }
    };
    const config = {
      errors: {
        list: {
          const: "Incorrect constant"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ list: ["c"] });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.list.const);
  });

  it("should show configuration error when value does not match enum", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        list: {
          type: "array",
          enum: [
            ["a", "b"],
            ["c", "d"]
          ]
        }
      }
    };
    const config = {
      errors: {
        list: {
          enum: "Incorrect enum"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ list: ["c"] });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.list.enum);
  });

  it("should show configuration error when values are not unique", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "array",
          uniqueItems: true
        }
      }
    };

    const config = {
      errors: {
        items: {
          uniqueItems: "Incorrect uniqueItems"
        }
      }
    };

    let yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;

    try {
      errorMessage = yupschema.validateSync({ items: ["b", "b"] });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(config.errors.items.uniqueItems);
  });
});
