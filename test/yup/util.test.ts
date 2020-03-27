import { JSONSchema7 } from "json-schema";
import { getObjectHead, removeEmptyObjects } from "../../src/yup/utils";
import { validateItemsArray } from "../../src/yup/addMethods/utils";

describe("removeEmptyObjects()", () => {
  it("should remove empty objects", () => {
    expect(
      removeEmptyObjects({
        type: "object",
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "test",
        title: "Test",
        properties: {
          name: {
            type: "string"
          }
        },
        if: {},
        then: { properties: {} }
      })
    ).toEqual({
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "string"
        }
      }
    });

    expect(
      removeEmptyObjects({
        type: "object",
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "test",
        title: "Test",
        properties: {
          name: {
            type: "array",
            items: [{ type: "string" }]
          }
        },
        if: {},
        then: { properties: {} }
      })
    ).toEqual({
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "array",
          items: [{ type: "string" }]
        }
      }
    });

    expect(
      removeEmptyObjects({
        type: "object",
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "test",
        title: "Test",
        properties: {
          name: {
            type: "array",
            items: []
          }
        }
      })
    ).toEqual({
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        name: {
          type: "array",
          items: []
        }
      }
    });
  });
});

describe("getObjectHead()", () => {
  it("should return first item in object as an array", () => {
    expect(getObjectHead({ a: { test: "a" } })).toBeTruthy();
    expect(getObjectHead({})).toBeFalsy();
  });
});

describe("validateItemsArray()", () => {
  it("should validate tuple with defined schema", () => {
    const schm: JSONSchema7["items"] = [
      { type: "number" },
      { type: "boolean" }
    ];
    const arr: any[] = [5, true];
    const validator = validateItemsArray(schm);
    const result = arr.every(validator);
    expect(result).toBeTruthy();
  });

  it("should NOT validate tuple with undefined schema", () => {
    const schm: JSONSchema7["items"] = [false];
    const arr: any[] = [5, true];
    const validator = validateItemsArray(schm);
    const result = arr.every(validator);
    expect(result).toBeFalsy();
  });
});
