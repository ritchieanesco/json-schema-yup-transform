import * as Yup from "yup";
import { minimumItems, maximumItems, contains, tuple } from "./array";
import { multipleOf } from "./number";
import { urlReference } from "./string";
import { Constant, Enum } from "./mixed";
// Array methods

Yup.addMethod<Yup.ArraySchema<unknown>>(
  Yup.array,
  "minimumItems",
  minimumItems
);

Yup.addMethod<Yup.ArraySchema<unknown>>(
  Yup.array,
  "maximumItems",
  maximumItems
);

Yup.addMethod<Yup.ArraySchema<unknown>>(Yup.array, "contains", contains);

Yup.addMethod<Yup.ArraySchema<any>>(Yup.array, "tuple", tuple);

// Number methods

Yup.addMethod<Yup.NumberSchema>(Yup.number, "multipleOf", multipleOf);

// String methods

Yup.addMethod<Yup.StringSchema>(Yup.string, "urlReference", urlReference);

// Mixed methods

Yup.addMethod<Yup.MixedSchema>(Yup.mixed, "constant", Constant);

Yup.addMethod<Yup.MixedSchema>(Yup.mixed, "enum", Enum);

export default Yup;
