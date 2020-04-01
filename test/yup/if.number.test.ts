import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() number conditions", () => {
  it("should validate all fields with exception to conditional fields", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          phone: { type: "number" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 4000
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional when dependency matches constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          productId: { type: "number" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 123145
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: "AA"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional when dependency matches enum", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000, 2000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", enum: [3000, 2000] } }
      },
      then: {
        properties: {
          productId: { type: "number" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 123145
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 2000,
      productId: 123145
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 2000
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: "AA"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      postcode: 2000,
      productId: "AA"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional when dependency matches minimum number", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        products: {
          type: "number"
        }
      },
      required: ["products"],
      if: {
        properties: { products: { type: "number", minimum: 100 } }
      },
      then: {
        properties: {
          productId: { type: "number", pattern: "^[0-9]*$" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      products: 101,
      productId: 123145
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      products: 101,
      productId: "AA"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      products: 99
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional when dependency matches maximum number", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        products: {
          type: "number"
        }
      },
      required: ["products"],
      if: {
        properties: { products: { type: "number", maximum: 100 } }
      },
      then: {
        properties: {
          productId: { type: "number" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      products: 99,
      productId: 123145
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      products: 101,
      productId: "AA"
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      products: 99
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional when dependency matches a multiple of", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        products: {
          type: "number"
        }
      },
      required: ["products"],
      if: {
        properties: { products: { type: "number", multipleOf: 100 } }
      },
      then: {
        properties: {
          productId: { type: "number" }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      products: 100,
      productId: 123145
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      products: 500,
      productId: "AA"
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      products: 200
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate required conditionals", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        products: {
          type: "number"
        }
      },
      required: ["products"],
      if: {
        properties: { products: { type: "number", const: 100 } }
      },
      then: {
        properties: {
          productId: { type: "number" }
        },
        required: ["productId"]
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      products: 100,
      productId: 123145
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      products: 100
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional constant when dependency matches constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          productId: { type: "number", const: 123 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 123
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 456
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional enum when dependency matches constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          productId: { type: "number", enum: [123, 456] }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 123
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 456
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 789
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate conditional minimum number when dependency matches constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          productId: { type: "number", minimum: 100 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 101
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 99
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      postcode: 4000
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional maximum number when dependency matches constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          productId: { type: "number", maximum: 100 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 99
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 101
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      postcode: 4000
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional multiple of number when dependency matches constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          productId: { type: "number", multipleOf: 100 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 500
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      postcode: 3000,
      productId: 101
    });
    expect(isValid).toBeFalsy();

    isValid = yupschema.isValidSync({
      postcode: 4000
    });
    expect(isValid).toBeTruthy();
  });

  it.only("should validate other conditional", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        postcode: {
          type: "number",
          enum: [3000, 4000]
        }
      },
      required: ["postcode"],
      if: {
        properties: { postcode: { type: "number", const: 3000 } }
      },
      then: {
        properties: {
          productId: { type: "number", multipleOf: 11 }
        }
      },
      else: {
        properties: {
          productId: { type: "number", multipleOf: 3 }
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    // let isValid = yupschema.isValidSync({
    //   postcode: 3000,
    //   productId: 55
    // });
    // expect(isValid).toBeTruthy();

    // isValid = yupschema.isValidSync({
    //   postcode: 3000,
    //   productId: 101
    // });
    // expect(isValid).toBeFalsy();

    // isValid = yupschema.isValidSync({
    //   postcode: 4000,
    //   productId: 6
    // });
    // expect(isValid).toBeTruthy();

    let isValid = yupschema.isValidSync({
      postcode: 4000,
      productId: 5
    });
    expect(isValid).toBeFalsy();
  });
});
