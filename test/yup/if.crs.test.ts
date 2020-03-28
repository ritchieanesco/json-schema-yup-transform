import * as Yup from "yup";
import { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

const schema: JSONSchema7 = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "crs",
  description: "CRS",
  type: "object",
  definitions: {
    country: {
      type: "object",
      properties: {
        taxResidentCountry: {
          type: "string",
          description: "The country of the resident"
        },
        hasTin: {
          type: "string"
        }
      },
      required: ["taxResidentCountry", "hasTin"],
      if: {
        properties: {
          hasTin: {
            const: "true"
          }
        }
      },
      then: {
        properties: {
          tin: {
            type: "string",
            minLength: 1,
            maxLength: 8
          }
        },
        required: ["tin"]
      },
      else: {
        properties: {
          tinUnavailableReason: {
            type: "string",
            minLength: 1,
            maxLength: 50
          }
        },
        required: ["tinUnavailableReason"]
      }
    }
  },
  properties: {
    isAustralianTaxResidentOnly: {
      type: "string"
    }
  },
  required: ["isAustralianTaxResidentOnly"],
  if: {
    properties: {
      isAustralianTaxResidentOnly: {
        const: "false"
      }
    }
  },
  then: {
    properties: {
      countries: {
        type: "array",
        items: {
          $ref: "#/definitions/country"
        },
        minItems: 1,
        maxItems: 5
      }
    },
    required: ["countries"]
  }
};

describe("convertToYup() CRS", () => {
  it("should validatate australia tax resident only ", () => {
    const yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "true"
    });
    expect(isValid).toBeTruthy();
  });

  it("should validatate non tax resident and has Tin", () => {
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "dfdsfsdf",
          hasTin: "true",
          tin: "test"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "dfdsfsdf",
          hasTin: "true"
        }
      ]
    });
    expect(isValid).toBeFalsy();
  });

  it("should validatate non tax resident and does not have Tin", () => {
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "dfdsfsdf",
          hasTin: "false",
          tinUnavailableReason: "test"
        }
      ]
    });

    expect(isValid).toBeTruthy();

    isValid = yupschema.isValidSync({
      isAustralianTaxResidentOnly: "false",
      countries: [
        {
          taxResidentCountry: "dfdsfsdf",
          hasTin: "false"
        }
      ]
    });
    expect(isValid).toBeFalsy();
  });
});
