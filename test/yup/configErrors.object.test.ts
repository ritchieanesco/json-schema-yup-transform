import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema"
import type { Config } from "../../src";
import convertToYup from "../../src";

describe("convertToYup() object configuration errors", () => {
  it("should show configuration error for incorrect data type", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object"
        }
      }
    };
    const config: Config = {
      errors: {
        defaults: {
          object: "Default object message"
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ address: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Default object message");
  });

  it("should show configuration CUSTOM error for incorrect data type", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object"
        }
      }
    };
    const config: Config = {
      errors: {
        defaults: {
          object: ([key]) => `${key} field has custom error message`
        }
      }
    };
    const yupschema = convertToYup(schema, config) as Yup.ObjectSchema;
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ address: "ABC" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("address field has custom error message");
  });

  it("should show configuration error for required", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object"
        }
      },
      required: ["address"]
    };
    const config: Config = {
      errors: {
        address: {
          required: "Address is required"
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
    expect(errorMessage).toBe("Address is required");
  });

  it("should show configuration CUSTOM error for required", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object"
        }
      },
      required: ["address"]
    };
    const config: Config = {
      errors: {
        address: {
          required: ([key, { required }]) =>
            `${key} field is in required fields. i.e. ${required}`
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
      "address field is in required fields. i.e. address"
    );
  });
});
