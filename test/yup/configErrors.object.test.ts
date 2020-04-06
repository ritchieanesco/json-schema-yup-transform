import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() object configuration errors", () => {
  it("should show configuration error for incorrect data type", () => {
    const schema: JSONSchema7 = {
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
    const config = {
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
    expect(errorMessage).toBe(config.errors.defaults.object);
  });

  it("should show configuration error for required", () => {
    const schema: JSONSchema7 = {
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
    const config = {
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
    expect(errorMessage).toBe(config.errors.address.required);
  });
});
