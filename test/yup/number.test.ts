import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() number", () => {
  it("should validate number type", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "number"
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      name: 123
    });
    expect(isValid).toBeTruthy();
    isValid = yupschema.isValidSync({
      name: "abv"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate multiple types", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: ["number", "null"]
        }
      }
    };
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      name: 123
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: null
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      name: ""
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate required", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number"
        }
      },
      required: ["years"]
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 5
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({});
    expect(valid).toBeFalsy();
    try {
      valid = yupschema.validateSync({});
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years is required");
  });

  it("should validate minimum", () => {
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
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 6
    });
    expect(valid).toBeTruthy();

    // testing rule is inclusive
    valid = yupschema.isValidSync({ years: 5 });
    expect(valid).toBeTruthy();

    try {
      valid = yupschema.validateSync({ years: 4 });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years requires a minimum value of 5");
  });

  it("should validate exclusive minimum", () => {
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
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 6
    });
    expect(valid).toBeTruthy();

    // testing rule is exclusive
    valid = yupschema.isValidSync({ years: 5 });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ years: 4 });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years requires a exclusive minimum value of 5");
  });

  it("should validate maximum", () => {
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
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    // testing rule is inclusive
    valid = yupschema.isValidSync({
      years: 5
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ years: 7 });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ years: 7 });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years requires a maximum value of 5");
  });

  it("should validate exclusive maximum", () => {
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
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 4
    });
    expect(valid).toBeTruthy();

    // testing rule is exclusive
    valid = yupschema.isValidSync({ years: 5 });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ years: 7 });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years requires a exclusive maximum value of 5");
  });

  it("should validate minimum and maximum", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          minimum: 5,
          maximum: 10
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 6
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ years: 11 });
    expect(valid).toBeFalsy();
  });

  it("should validate exclusive minimum and exclusive maximum", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          exclusiveMinimum: 5,
          exclusiveMaximum: 10
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 5
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ years: 10 });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      years: 7
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ years: 8 });
    expect(valid).toBeTruthy();
  });

  it("should throw error when maximum and exclusive maximum are used together", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          exclusiveMaximum: 5,
          maximum: 5
        }
      }
    };
    expect(() => {
      convertToYup(schema);
    }).toThrowError(
      "Maximum and exclusive maximum keys can not be used together"
    );
  });

  it("should throw error when minimum and exclusive minimum are used together", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          exclusiveMinimum: 5,
          minimum: 5
        }
      }
    };
    expect(() => {
      convertToYup(schema);
    }).toThrowError(
      "Minimum and exclusive minimum keys can not be used together"
    );
  });

  it("should validate multiple of", () => {
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
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    // testing rule is inclusive
    valid = yupschema.isValidSync({
      years: 5
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ years: 7 });
    expect(valid).toBeFalsy();

    try {
      valid = yupschema.validateSync({ years: 7 });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years requires a multiple of 5");
  });

  it("should validate constant", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          const: 2
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 2
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ years: 3 });
    expect(valid).toBeFalsy();
    try {
      valid = yupschema.validateSync({ years: 3 });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years does not match constant");
  });

  it("should validate enum", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        years: {
          type: "number",
          enum: [2, 3]
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid;

    valid = yupschema.isValidSync({
      years: 2
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      years: 3
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ years: 4 });
    expect(valid).toBeFalsy();
    try {
      valid = yupschema.validateSync({ years: 4 });
    } catch (e) {
      valid = e.errors[0];
    }
    expect(valid).toBe("Years does not match any of the enumerables");
  });

  it("should set default value", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        age: {
          type: "number",
          default: 7
        }
      },
      required: ["age"]
    };

    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({});
    expect(isValid).toBeTruthy();

    let field = Yup.reach(yupschema, "age");
    // @ts-ignore
    expect(field._default).toBe(7);
  });
});
