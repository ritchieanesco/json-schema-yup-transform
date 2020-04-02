# Transform a JSON Schema to Yup Schema

[![Build Status](https://travis-ci.com/ritchieanesco/json-schema-yup-transform.svg?branch=master)](https://travis-ci.com/ritchieanesco/json-schema-yup-transform)
[![Coverage Status](https://coveralls.io/repos/github/ritchieanesco/json-schema-yup-transform/badge.svg?branch=master)](https://coveralls.io/github/ritchieanesco/json-schema-yup-transform?branch=master)

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

## Supported features

String, Number, Integer, Array, Object, Boolean and Null types are supported.
The tables below outline which keywords each schema type supports.

### String types

| Keyword                | Supported |
| ---------------------- | --------- |
| const                  | Yes       |
| enum                   | Yes       |
| minLength              | Yes       |
| maxLength              | Yes       |
| pattern                | Yes       |
| date-time (format)     | Yes       |
| time (format)          | Yes       |
| date (format)          | Yes       |
| email (format)         | Yes       |
| idn-email (format)     | Yes       |
| hostname (format)      | Yes       |
| idn-hostname (format)  | Yes       |
| ipv4 (format)          | Yes       |
| ipv6 (format)          | Yes       |
| uri (format)           | Yes       |
| uri-reference (format) | Yes       |
| iri (format)           | No        |
| iri-reference (format) | No        |
| uri-template (format)  | No        |
| json-pointer           | No        |
| relative-json-pointer  | No        |
| regex                  | No        |

### Number and Integer types

| Keyword          | Supported |
| ---------------- | --------- |
| const            | Yes       |
| enum             | Yes       |
| multipleOf       | Yes       |
| minimum          | Yes       |
| exclusiveMaximum | Yes       |
| maximum          | Yes       |
| exclusiveMaximum | Yes       |

### Array types

| Keyword         | Supported |
| --------------- | --------- |
| items           | Yes       |
| contains        | Yes       |
| tuple           | Yes       |
| additionalItems | No        |
| minItems        | Yes       |
| maxItems        | Yes       |
| uniqueItems     | No        |

### Object types

| Keyword              | Supported |
| -------------------- | --------- |
| required             | Yes       |
| properties           | Yes       |
| additionalProperties | No        |
| propertyNames        | No        |
| size                 | No        |
| dependencies         | No        |
| patternProperties    | No        |

### Generic keywords

| Keyword                               | Supported |
| ------------------------------------- | --------- |
| default                               | Yes       |
| enum (String, Integer, Number)        | Yes       |
| const (String, Integer, Number)       | Yes       |
| title                                 | No        |
| description (used to store node path) | Yes       |
| if                                    | Yes       |
| then                                  | Yes       |
| else                                  | Yes       |
| definitions                           | Yes       |
| $id                                   | Yes       |

### Extending Schemas

| Keyword | Supported |
| ------- | --------- |
| allOf   | No        |
| anyOf   | No        |
| oneOf   | No        |
| not     | No        |

## Usage

**Provide a valid schema and `convertToYup` will transform it to a yup schema.**

```js
    import { convertToYup } from "json-schema-yup-transformer";
    const schema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
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

    const yupschema = convertToYup(schema)
    const isValid = yupschema.isValidsync({
        name: "Bruce Tanek"
    })
    // => true
```
**Applying conditional rules**

```js
    import { convertToYup } from "json-schema-yup-transformer";

    const schema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
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
    import { convertToYup } from "json-schema-yup-transformer";
    const schema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
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
    //          case 'number':
    //              return number();
    //          case 'string':
    //              return string();
    //          default:
    //              return mixed();
    //       }
    //    })
    // })

    // check validity

    const yupschema = convertToYup(schema)
    const isValid = yupschema.isValidsync({
        name: null
    })
    // => true
```

**Providing custom error messages**

The structure of the configuration error messages need to adhere to the path of that field in the schema as well as the associated schema validation keyword.

```js
    import { convertToYup } from "json-schema-yup-transformer";
    const schema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
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
    }

    // check validity
    const yupschema = convertToYup(schema, config)
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
    import { convertToYup } from "json-schema-yup-transformer";
    const schema = {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "test",
      title: "Test",
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

    // set default error message for type of string

    const config = {
        errors: {
            defaults: {
                string: "Custom error message"
            }
        }
    }

    // check validity
    const yupschema = convertToYup(schema, config)
    let errorMessage;
    try {
      errorMessage = yupschema.validateSync();
    } catch (e) {
      errorMessage = e.errors[0];
    }
    // => "Custom error message"
```