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