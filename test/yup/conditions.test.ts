import { JSONSchema7 } from "json-schema";
import { createConditionSchema } from "../../src/yup/schemas/conditions";
import Yup from "../../src/yup/addMethods";

describe("createConditionSchema()", () => {
  it("should return original schema when if schema is empty", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        }
      },
      required: ["country"],
      if: {},
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };

    const result = createConditionSchema(Yup.string(), schema, "country");
    expect(result.toString()).toEqual(Yup.string().toString());
  });

  it("should return original schema when if schema properties is empty", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        }
      },
      required: ["country"],
      if: {
        properties: {}
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };

    const result = createConditionSchema(Yup.string(), schema, "country");
    expect(result.toString()).toEqual(Yup.string().toString());
  });

  it("should return original schema when if schema property item is empty", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        }
      },
      required: ["country"],
      if: {
        properties: {
          country: false
        }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };

    const result = createConditionSchema(Yup.string(), schema, "country");
    expect(result.toString()).toEqual(Yup.string().toString());
  });

  it("should bypass then schema if property is missing", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        }
      },
      required: ["country"],
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: false
        }
      }
    };

    const postalSchema = createConditionSchema(
      Yup.string(),
      schema,
      "postal_code"
    );
    const validator = Yup.object().shape({
      country: Yup.string(),
      postal_code: postalSchema
    });

    const isValid = validator.isValidSync({
      country: "Australia",
      postal_code: "ASDASDA"
    });
    expect(isValid).toBeTruthy();
  });

  it("should bypass else schema if property is missing", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        country: {
          type: "string",
          enum: ["Australia", "Canada"]
        }
      },
      required: ["country"],
      if: {
        properties: { country: { type: "string", const: "Australia" } }
      },
      then: {
        properties: {
          postal_code: { type: "string", maxLength: 8 }
        }
      },
      else: {
        properties: {
          postal_code: false
        }
      }
    };

    const postalSchema = createConditionSchema(
      Yup.string(),
      schema,
      "postal_code"
    );
    const validator = Yup.object().shape({
      country: Yup.string(),
      postal_code: postalSchema
    });

    const isValid = validator.isValidSync({
      country: "Canada",
      postal_code: "ASDASDA"
    });
    expect(isValid).toBeTruthy();
  });
});
