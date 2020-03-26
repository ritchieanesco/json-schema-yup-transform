import { JSONSchema7 } from "json-schema";
import {
  getIfCondition,
  getThenCondition,
  getElseCondition
} from "../../src/schema";

describe("getIfCondition()", () => {
  it("should not process undefined schema", () => {
    expect(getIfCondition(undefined, "test")).toBeFalsy();
  });
  it("should not process undefined If schema", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        other: {
          type: "string"
        }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    expect(getIfCondition(schema, "other")).toBeFalsy();
  });
  it("should get If schema", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        other: {
          type: "string"
        }
      },
      if: {
        properties: {
          other: {
            const: "test"
          }
        }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    expect(getIfCondition(schema, "other")).toBeTruthy();
  });
});

describe("getThenCondition()", () => {
  it("should not process undefined schema", () => {
    expect(getThenCondition(undefined, "test")).toBeFalsy();
  });
  it("should not process undefined Then schema", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        other: {
          type: "string"
        }
      }
    };
    expect(getThenCondition(schema, "other")).toBeFalsy();
  });
  it("should get Then schema", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        other: {
          type: "string"
        }
      },
      if: {
        properties: {
          other: {
            const: "test"
          }
        }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      }
    };
    expect(getThenCondition(schema, "postal_code")).toBeTruthy();
  });
});

describe("getElseCondition()", () => {
  it("should not process undefined schema", () => {
    expect(getElseCondition(undefined, "test")).toBeFalsy();
  });
  it("should not process undefined Else schema", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        other: {
          type: "string"
        }
      }
    };
    expect(getElseCondition(schema, "other")).toBeFalsy();
  });
  it("should get Else schema", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        other: {
          type: "string"
        }
      },
      if: {
        properties: {
          other: {
            const: "test"
          }
        }
      },
      then: {
        properties: {
          postal_code: { type: "string", pattern: "[0-9]{5}(-[0-9]{4})?" }
        }
      },
      else: {
        properties: {
          postal_code: { type: "string", const: "test" }
        }
      }
    };
    expect(getElseCondition(schema, "postal_code")).toBeTruthy();
  });
});
