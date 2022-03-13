import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema"
import type { Config } from "../../src";
import convertToYup from "../../src";

describe("convertToYup() number configuration errors", () => {
  it("should show configuration error for incorrect data type", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        defaults: {
          number: "Default number message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ age: "ABC" });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Default number message");
  });

  it("should show configuration CUSTOM error for incorrect data type", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        defaults: {
          number: ([key]) => `${key} field is invalid`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ age: "ABC" });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("age field is invalid");
  });

  it("should show configuration error for required", () => {
    const schema: JSONSchema = {
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
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({});
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Age (number) is required");
  });

  it("should show configuration CUSTOM error for required", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        age: {
          required: ([key, { required }]) =>
            `${key} field is required. i.e. Required fields are ${required}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({});
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "age field is required. i.e. Required fields are age"
    );
  });

  it("should show configuration error when value does not meet minimum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          minimum: "Does not meet minimum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 3 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Does not meet minimum number");
  });

  it("should show configuration CUSTOM error for minimum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          minimum: ([key, { minimum }]) =>
            `${key} field is invalid. Needs a minimum number of ${minimum}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 3 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "years field is invalid. Needs a minimum number of 5"
    );
  });

  it("should show configuration error when value does not meet exclusive minimum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          exclusiveMinimum: "Does not meet exclusive minimum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 3 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Does not meet exclusive minimum number");
  });

  it("should show configuration CUSTOM error for exclusive minimum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          exclusiveMinimum: ([key, { exclusiveMinimum }]) =>
            `${key} is invalid. It needs a minimum value of ${exclusiveMinimum}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 3 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "years is invalid. It needs a minimum value of 5"
    );
  });

  it("should show configuration error when value does not meet maximum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          maximum: "Does not meet maximum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Does not meet maximum number");
  });

  it("should show configuration CUSTOM error for maximum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          maximum: ([key, { maximum }]) =>
            `${key} is invalid. It needs a maximum value of ${maximum}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "years is invalid. It needs a maximum value of 5"
    );
  });

  it("should show configuration error when value does not meet exclusive maximum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          exclusiveMaximum: "Does not meet exclusive maximum number"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Does not meet exclusive maximum number");
  });

  it("should show configuration CUSTOM error for exclusive maximum number", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          exclusiveMaximum: ([key, { exclusiveMaximum }]) =>
            `${key} is invalid. It needs a maximum value of ${exclusiveMaximum}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError)  errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "years is invalid. It needs a maximum value of 5"
    );
  });

  it("should show configuration error when value does not match multiple of", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          multipleOf: "Value is not multiple of 5"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Value is not multiple of 5");
  });

  it("should show configuration CUSTOM error for multiple of", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          multipleOf: ([key, { multipleOf }]) =>
            `${key} is invalid. Value needs to be a multiple of ${multipleOf}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "years is invalid. Value needs to be a multiple of 5"
    );
  });

  it("should show configuration error when value does not match constant", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          const: "Value does not match 5"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Value does not match 5");
  });

  it("should show configuration CUSTOM error for constant", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          const: ([key, { const: consts }]) =>
            `${key} is invalid. It needs to match ${consts}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("years is invalid. It needs to match 5");
  });

  it("should show configuration error when value does not match one of enums", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          enum: "Value does not match 5 or 9"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Value does not match 5 or 9");
  });

  it("should show configuration CUSTOM error for enums", () => {
    const schema: JSONSchema = {
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
    const config: Config = {
      errors: {
        years: {
          enum: ([key, { enum: enums }]) =>
            `${key} is invalid. Value needs to match one of the following enums ${enums}`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema<any>;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ years: 7 });
    } catch (e: unknown) {
      if (e instanceof Yup.ValidationError) errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "years is invalid. Value needs to match one of the following enums 5,9"
    );
  });
});