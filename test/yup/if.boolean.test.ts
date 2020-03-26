import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() boolean conditions", () => {
  it("should validate all fields with exception to conditional fields", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        consent: {
          type: "boolean"
        }
      },
      required: ["consent"],
      if: {
        properties: { consent: { const: true } }
      },
      then: {
        properties: {
          phone: { type: "number" }
        }
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      consent: false
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      consent: true
    });
    expect(isValid).toBeTruthy();
  });

  it("should validate conditional when dependency matches constant", () => {
    let schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        consent: {
          type: "boolean"
        }
      },
      required: ["consent"],
      if: {
        properties: { consent: { const: true } }
      },
      then: {
        properties: {
          phone: { type: "number" }
        }
      }
    };
    let yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      consent: false
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      consent: true,
      phone: 12345
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      consent: true,
      phone: "ABC"
    });
    expect(isValid).toBeFalsy();

    schm = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        consent: {
          type: "boolean"
        }
      },
      required: ["consent"],
      if: {
        properties: { consent: { const: true } }
      },
      then: {
        properties: {
          confirm: { type: "boolean" }
        }
      }
    };
    yupschema = convertToYup(schm) as Yup.ObjectSchema;

    isValid = yupschema.isValidSync({
      consent: true,
      confirm: true
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      consent: true,
      confirm: "ABC"
    });
    expect(isValid).toBeFalsy();
  });

  it("should validate required conditional", () => {
    const schm: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        consent: {
          type: "boolean"
        }
      },
      required: ["consent"],
      if: {
        properties: { consent: { const: true } }
      },
      then: {
        properties: {
          phone: { type: "number" }
        },
        required: ["phone"]
      }
    };
    const yupschema = convertToYup(schm) as Yup.ObjectSchema;

    let isValid = yupschema.isValidSync({
      consent: true,
      phone: 12345
    });
    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      consent: true
    });
    expect(isValid).toBeFalsy();
  });
});
