import * as Yup from "yup";
import type { JSONSchema } from "../../src/schema"
import convertToYup from "../../src";

describe("convertToYup() object", () => {
  it("should validate object type", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "object"
        }
      }
    };

    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let isValid = yupschema.isValidSync({
      items: {}
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: { a: "a" }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      items: "test123"
    });
    expect(isValid).toBeFalsy();
  });
  it("should validate required", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        items: {
          type: "object"
        }
      },
      required: ["items"]
    };

    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;
    let isValid = yupschema.isValidSync({});
    expect(isValid).toBeFalsy();
  });

  it("should validate nested object type", () => {
    let schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object",
          properties: {
            state: { type: "string" },
            postcode: { type: "string" }
          }
        }
      }
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      address: {
        state: "VIC",
        postcode: "3030"
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: {
        state: "VIC",
        postcode: null
      }
    });
    expect(isValid).toBeFalsy();

    schema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: "object",
          properties: {
            mailingAddress: {
              type: "object",
              properties: {
                state: { type: "string" },
                postcode: { type: "string" }
              }
            }
          }
        }
      }
    };

    yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    isValid = yupschema.isValidSync({
      address: {
        mailingAddress: {
          state: "VIC",
          postcode: "3030"
        }
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: {
        mailingAddress: {
          state: "VIC",
          postcode: null
        }
      }
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate multiple types", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: ["object", "null"],
          properties: {
            state: { type: "string" }
          }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      address: {
        state: "VIC"
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: null
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate fields from definitions", () => {
    let schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: {
        address: {
          type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" }
          },
          required: ["street_address", "city", "state"]
        }
      },
      properties: {
        mailingAddress: {
          $ref: "#/definitions/address"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      mailingAddress: {
        street_address: "test",
        city: "Melbourne",
        state: "VIC"
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      mailingAddress: {
        street_address: "test",
        city: "Melbourne",
        state: null
      }
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate fields from definitions", () => {
    let schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: undefined,
      properties: {
        mailingAddress: {
          $ref: "#/definitions/address"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      mailingAddress: {
        street_address: "test",
        city: "Melbourne",
        state: "VIC"
      }
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate fields using definition id", () => {
    let schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      definitions: {
        address: {
          $id: "#address",
          type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" }
          },
          required: ["street_address", "city", "state"]
        }
      },
      properties: {
        mailingAddress: {
          $ref: "#address"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      mailingAddress: {
        street_address: "test",
        city: "Melbourne",
        state: "VIC"
      }
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      mailingAddress: {
        street_address: "test",
        city: "Melbourne",
        state: null
      }
    });
    expect(isValid).toBeFalsy();
  });

  it("should bypass field if not an object", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string"
        },
        test: true
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      name: "test"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: null
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate multiple types", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          type: ["object", "null"]
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema<any>;

    let isValid = yupschema.isValidSync({
      address: {}
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: null
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      address: ""
    });
    expect(isValid).toBeTruthy();
  });

  it("should throw error when type key is missing", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        address: {
          const: "test"
        }
      }
    };
    expect(() => {
      convertToYup(schema) as Yup.ObjectSchema<any>;
    }).toThrowError("Type key is missing");
  });

  it("should return undefined when properties does not exist", () => {
    const schema: JSONSchema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test"
    };
    const yupschema = convertToYup(schema);
    expect(yupschema).toBeUndefined();
  });
});
