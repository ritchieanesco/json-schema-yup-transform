# Transform a JSON Schema to Yup Schema

[![Build Status](https://travis-ci.com/ritchieanesco/json-schema-yup-transform.svg?branch=master)](https://travis-ci.com/ritchieanesco/json-schema-yup-transform)
[![Coverage Status](https://coveralls.io/repos/github/ritchieanesco/json-schema-yup-transform/badge.svg?branch=master)](https://coveralls.io/github/ritchieanesco/json-schema-yup-transform?branch=master)
[![npm version](https://badge.fury.io/js/json-schema-yup-transformer.svg)](https://badge.fury.io/js/json-schema-yup-transformer)

A utility to generate a Yup Schema from a valid JSON Schema.

json-schema-yup-transform is heavily inspired by [schema-to-yup](https://github.com/kristianmandrup/schema-to-yup) but strictly supports the draft 7 [specification](https://json-schema.org/draft/2019-09/release-notes.html)

The main objective is to support as many of the features of the draft 7 specification as possible.

## Building

The project is written in [TypeScript](https://github.com/Microsoft/TypeScript).

```sh
$ yarn build
```

Output goes into the `dist/` directory.

## Testing

Tests and code coverage are run with [Jest](https://github.com/facebook/jest).

```sh
$ yarn test
```

## Useful Tools

- [JSON Schema Validator](https://www.jsonschemavalidator.net/)

## Supported features

String, Number, Integer, Array, Object, Boolean and Null types are supported.
The tables below outline which keywords each schema type supports.

### String types

| Keyword                | Supported                |
| ---------------------- | ------------------------ |
| const                  | :heavy_check_mark:       |
| enum                   | :heavy_check_mark:       |
| minLength              | :heavy_check_mark:       |
| maxLength              | :heavy_check_mark:       |
| pattern                | :heavy_check_mark:       |
| date-time (format)     | :heavy_check_mark:       |
| time (format)          | :heavy_check_mark:       |
| date (format)          | :heavy_check_mark:       |
| email (format)         | :heavy_check_mark:       |
| idn-email (format)     | :heavy_check_mark:       |
| hostname (format)      | :heavy_check_mark:       |
| idn-hostname (format)  | :heavy_check_mark:       |
| ipv4 (format)          | :heavy_check_mark:       |
| ipv6 (format)          | :heavy_check_mark:       |
| uri (format)           | :heavy_check_mark:       |
| uri-reference (format) | :heavy_check_mark:       |
| iri (format)           | :heavy_multiplication_x: |
| iri-reference (format) | :heavy_multiplication_x: |
| uri-template (format)  | :heavy_multiplication_x: |
| json-pointer           | :heavy_multiplication_x: |
| relative-json-pointer  | :heavy_multiplication_x: |
| regex                  | :heavy_check_mark:       |

### Number and Integer types

| Keyword          | Supported          |
| ---------------- | ------------------ |
| const            | :heavy_check_mark: |
| enum             | :heavy_check_mark: |
| multipleOf       | :heavy_check_mark: |
| minimum          | :heavy_check_mark: |
| exclusiveMaximum | :heavy_check_mark: |
| maximum          | :heavy_check_mark: |
| exclusiveMaximum | :heavy_check_mark: |

### Array types

| Keyword         | Supported                |
| --------------- | ------------------------ |
| const           | :heavy_check_mark:       |
| enum            | :heavy_check_mark:       |
| items           | :heavy_check_mark:       |
| contains        | :heavy_check_mark:       |
| tuple           | :heavy_check_mark:       |
| additionalItems | :heavy_multiplication_x: |
| minItems        | :heavy_check_mark:       |
| maxItems        | :heavy_check_mark:       |
| uniqueItems     | :heavy_check_mark:       |

### Boolean types

| Keyword | Supported          |
| ------- | ------------------ |
| const   | :heavy_check_mark: |

### Object types

| Keyword              | Supported                |
| -------------------- | ------------------------ |
| required             | :heavy_check_mark:       |
| properties           | :heavy_check_mark:       |
| additionalProperties | :heavy_multiplication_x: |
| propertyNames        | :heavy_multiplication_x: |
| size                 | :heavy_multiplication_x: |
| dependencies         | :heavy_multiplication_x: |
| patternProperties    | :heavy_multiplication_x: |

### Generic keywords

| Keyword                               | Supported          |
| ------------------------------------- | ------------------ |
| default                               | :heavy_check_mark: |
| description (used to store node path) | :heavy_check_mark: |
| if                                    | :heavy_check_mark: |
| then                                  | :heavy_check_mark: |
| else                                  | :heavy_check_mark: |
| definitions                           | :heavy_check_mark: |
| \$id                                  | :heavy_check_mark: |

### Extending Schemas

| Keyword | Supported          |
| ------- | ------------------ |
| allOf   | :heavy_check_mark: |
| anyOf   | :heavy_check_mark: |
| oneOf   | :heavy_check_mark: |
| not     | :heavy_check_mark: |

## Usage

**Provide a valid schema and `convertToYup` will transform it to a yup schema.**

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "example",
  title: "Example",
  properties: {
    name: {
      type: "string"
    }
  }
};

// the yup equivalent of the above json schema
// const yupschema = Yup.object().shape({
//     name: Yup.string()
// })

// check validity

const yupschema = convertToYup(schema);
const isValid = yupschema.isValidsync({
  name: "Bruce Tanek"
});
// => true
```

**Applying conditional rules**

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "example-conditional-rules",
  title: "Example of conditional rules",
  properties: {
    country: {
      type: "string"
    }
  },
  required: ["country"]
  if: {
      properties: {
          country: {
            const: "Australia"
          }
      }
  }
  then: {
      properties: {
          residencyYears: {
              type: "number",
              minimum: 12
          }
      },
      required: ["residencyYears"]
  }
};

// the yup equivalent of the above json schema
// const yupschema = Yup.object().shape({
//     country: Yup.string().required(),
//     residencyYears: Yup.number().when('country', {
//      is: 'true'
//      then: Yup.number().required()
//    })
// })

// check validity

const yupschema = convertToYup(schema)
const isValid = yupschema.isValidsync({
    country: "Australia",
    residencyYears: 15
})
// => true
```

**Applying multiple types**

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "example-multiple-types",
  title: "Example of multiple types",
  properties: {
    name: {
      type: ["string", "null"]
    }
  }
};

// the yup equivalent of the above json schema
// const yupschema = Yup.object().shape({
//     name: Yup.lazy(value => {
//       switch (typeof value) {
//          case 'string':
//              return Yup.number();
//          case 'null':
//              return Yup.mixed().notRequired();
//          default:
//              return Yup.mixed();
//       }
//    })
// })

// check validity

const yupschema = convertToYup(schema);
const isValid = yupschema.isValidsync({
  name: null
});
// => true
```

**Providing custom error messages**

The structure of the configuration error messages need to adhere to the path of that field in the schema as well as the associated schema validation keyword.

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "example-custom-error-messages",
  title: "Exampel of custom error messages",
  properties: {
    team: {
      type: "object",
      properties: {
        name: {
          type: "string"
        }
      }
    }
  },
  required: ["name"]
};

// configuration for custom error messages

const config = {
  errors: {
    team: {
      name: {
        required: "Custom error message"
      }
    }
  }
};

// check validity
const yupschema = convertToYup(schema, config);
let errorMessage;
try {
  errorMessage = yupschema.validateSync();
} catch (e) {
  errorMessage = e.errors[0];
}
// => "Custom error message"
```

Setting default error messages for a type

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "example-default-error-messages",
  title: "Example of default error messages",
  properties: {
    team: {
      type: "object",
      properties: {
        name: {
          type: "string"
        }
      }
    }
  }
};

// set default error message for type of string

const config = {
  errors: {
    defaults: {
      string: "Custom error message"
    }
  }
};

// check validity
const yupschema = convertToYup(schema, config);
let errorMessage;
try {
  errorMessage = yupschema.validateSync({
    team: {
      name: null
    }
  });
} catch (e) {
  errorMessage = e.errors[0];
}
// => "Custom error message"
```

Applying definitions and \$ref

```js
import convertToYup from "json-schema-yup-transformer";

let schema: JSONSchema7 = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "example-definitions",
  title: "Example of definitions",
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

// check validity
const yupschema = convertToYup(schema);
const isValid = yupschema.isValidsync({
  mailingAddress: {
    street_address: "18 Rover street",
    city: "New York City",
    state: "New York"
  }
});
// => true
```

**Validate against `allof` subschemas**

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "test",
  title: "Test",
  properties: {
    things: {
      allOf: [
        { type: "string", minLength: 4 },
        { type: "string", maxLength: 6 }
      ]
    }
  }
};

// check validity
let yupschema = convertToYup(schema);
let isValid = yupschema.isValidSync({
  things: "12345"
});
// => true
```

**Validate against `anyof` subschemas**

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "test",
  title: "Test",
  properties: {
    things: {
      anyOf: [
        { type: "string", minLength: 6 },
        { type: "string", const: "test" }
      ]
    }
  }
};

// check validity
let yupschema = convertToYup(schema);
let isValid = yupschema.isValidSync({
  things: "test"
});
// => true
```

**Validate against `not` subschemas**

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "test",
  title: "Test",
  properties: {
    things: {
      not: { type: "string", minLength: 6 }
    }
  }
};

// check validity
let yupschema = convertToYup(schema);
let isValid = yupschema.isValidSync({
  things: "1234"
});
// => true
```

**Validate against `oneof` subschemas**

```js
import convertToYup from "json-schema-yup-transformer";

const schema = {
  type: "object",
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "test",
  title: "Test",
  properties: {
    things: {
      oneOf: [
        { type: "string", minLength: 6 },
        { type: "string", minLength: 3 }
      ]
    }
  }
};

// check validity
let yupschema = convertToYup(schema);
let isValid = yupschema.isValidSync({
  things: "1234"
});
// => true
```
