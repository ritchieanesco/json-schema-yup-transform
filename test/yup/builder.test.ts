import { buildObject } from "../../src/yup/builder/builder";

describe("buildObject()", () => {
  it("should return original object if NO properties", () => {
    const schm = {};
    expect(buildObject(schm, ["test", {}])).toEqual({});
  });
});
