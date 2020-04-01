import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() array configuration errors", () => {
  it("should show configuration error for incorrect data type", () => {
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

  it("should show configuration error for required", () => {
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
});
