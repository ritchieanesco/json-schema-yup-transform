import * as Yup from "yup";
import type { JSONSchema7 } from "json-schema";
import convertToYup from "../../src";

describe("convertToYup() string format", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("should validate date-time format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        event: {
          type: "string",
          format: "date-time"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      event: "2018-11-13T20:20:39+00:00"
    });
    expect(valid).toBeTruthy();

    // validate month
    valid = yupschema.isValidSync({ event: "2018-14-13T20:20:39+00:00" });
    expect(valid).toBeFalsy();

    // validate day
    valid = yupschema.isValidSync({ event: "2018-11-32T20:20:39+00:00" });
    expect(valid).toBeFalsy();

    // validate hour
    valid = yupschema.isValidSync({ event: "2018-11-32T20:26:39+00:00" });
    expect(valid).toBeFalsy();

    // validate minutes
    valid = yupschema.isValidSync({ event: "2018-11-32T20:80:39+00:00" });
    expect(valid).toBeFalsy();

    // validate seconds
    valid = yupschema.isValidSync({ event: "2018-11-32T20:80:70+00:00" });
    expect(valid).toBeFalsy();

    // validate milliseconds
    valid = yupschema.isValidSync({ event: "2018-11-32T20:80:39+70:00" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ event: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ event: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Event is an invalid date and time format");
  });

  it("should validate time format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        event: {
          type: "string",
          format: "time"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({ event: "20:20:39+00:00" });
    expect(valid).toBeTruthy();

    // validate hour
    valid = yupschema.isValidSync({ event: "26:20:39+00:00" });
    expect(valid).toBeFalsy();

    // validate minutes
    valid = yupschema.isValidSync({ event: "20:80:39+00:00" });
    expect(valid).toBeFalsy();

    // validate seconds
    valid = yupschema.isValidSync({ event: "20:80:70+00:00" });
    expect(valid).toBeFalsy();

    // validate milliseconds
    valid = yupschema.isValidSync({ event: "20:80:39+70:00" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ event: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ event: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Event is an invalid time format");
  });

  it("should validate date format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        event: {
          type: "string",
          format: "date"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      event: "2018-11-13"
    });
    expect(valid).toBeTruthy();

    // validate month
    valid = yupschema.isValidSync({ event: "2018-14-13" });
    expect(valid).toBeFalsy();

    // validate day
    valid = yupschema.isValidSync({ event: "2018-11-32" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ event: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ event: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Event is an invalid date format");
  });

  it("should validate email format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        email: {
          type: "string",
          format: "email"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      email: "test@test.com"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: "test@example.com.au"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: "1234567890@example.com"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: '"email"@example.com'
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ email: "@test" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ email: "test@test" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ email: "test.com" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ email: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ email: "test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Email is an invalid email format");
  });

  it("should validate IDN email format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        email: {
          type: "string",
          format: "idn-email"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      email: "用户@maimail.com"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: "用户@例子.广告"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: "θσερ@εχαμπλε.ψομ"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: "अजय@डाटा.भारत"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: "1234567890@example.com"
    });
    expect(valid).toBeTruthy();

    yupschema.isValidSync({
      email: '"email"@example.com'
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({ email: "@test" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ email: "test@test" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ email: "test.com" });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({ email: null });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ email: "test" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Email is an invalid international email format");
  });

  it("should validate hostname format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "hostname"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      website: "example.org"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "!jkfdcom"
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      website: "@mfd.com"
    });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Website is an invalid hostname format");
  });

  it("should validate international hostname format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "idn-hostname"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      website: "xn-fsqu00a.xn-0zwm56d"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "xn--stackoverflow.com"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "example.org"
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      website: "@mfd.com"
    });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe(
      "Website is an invalid international hostname format"
    );
  });

  it("should validate ipv4 format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "ipv4"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      website: "8.8.8.8"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "192.14.23.4"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "1.0.0.255"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "example.org"
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      website: "@mfd.com"
    });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Website is an invalid ipv4 format");
  });

  it("should validate ipv6 format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "ipv6"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      website: "1200:0000:AB00:1234:0000:2552:7777:1313"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "21DA:D3:0:2F3B:2AA:FF:FE28:9C5A"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "1762:0:0:0:0:B03:1:AF18"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "example.org"
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      website: "192.168.1.1"
    });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Website is an invalid ipv6 format");
  });

  it("should validate uri format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "uri"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    let valid = yupschema.isValidSync({
      website: "http://example.org/test?id=123"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "http://example.org"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "https://example.org"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "192.168.1.1"
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      website: "htt://ww.example.org"
    });
    expect(valid).toBeFalsy();

    valid = yupschema.isValidSync({
      website: "://example.org"
    });
    expect(valid).toBeFalsy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "(800)FLOWERS" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Website is an invalid URI format");
  });

  it("should validate uri relative path format", () => {
    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "uri-reference"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;

    let valid = yupschema.isValidSync({
      website: "/tutorial1/"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "/tutorial1/2.html"
    });
    expect(valid).toBeTruthy();

    valid = yupschema.isValidSync({
      website: "/experts/"
    });
    expect(valid).toBeTruthy();

    let errorMessage;
    try {
      errorMessage = yupschema.validateSync({ website: "http://example.org" });
    } catch (e) {
      errorMessage = e.errors[0];
    }
    expect(errorMessage).toBe("Website is an invalid URI reference format");
  });

  it("should render warning for iri use", () => {
    const spy = jest.spyOn(console, "warn");

    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "iri"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    yupschema.isValidSync({
      website: "/tutorial1/"
    });
    expect(spy).toHaveBeenCalled();
  });

  it("should render warning for iri use", () => {
    const spy = jest.spyOn(console, "warn");

    const schema: JSONSchema7 = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
      properties: {
        website: {
          type: "string",
          format: "iri-reference"
        }
      }
    };
    let yupschema = convertToYup(schema) as Yup.ObjectSchema;
    yupschema.isValidSync({
      website: "/tutorial1/"
    });
    expect(spy).toHaveBeenCalled();
  });
});
