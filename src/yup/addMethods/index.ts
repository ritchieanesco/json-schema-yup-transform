import * as Yup from "yup";
import {
  minimumItems,
  maximumItems,
  contains,
  tuple,
  uniqueItems
} from "./array";
import { multipleOf } from "./number";
import { urlReference } from "./string";
import { constant, enums } from "./mixed";
// Array methods

Yup.addMethod(Yup.array, "minimumItems", minimumItems);

Yup.addMethod(Yup.array, "maximumItems", maximumItems);

Yup.addMethod(Yup.array, "contains", contains);

Yup.addMethod(Yup.array, "tuple", tuple);

Yup.addMethod(Yup.array, "uniqueItems", uniqueItems);

// Number methods

Yup.addMethod(Yup.number, "multipleOf", multipleOf);

// String methods

Yup.addMethod(Yup.string, "urlReference", urlReference);

// Mixed methods

Yup.addMethod(Yup.mixed, "constant", constant);

Yup.addMethod(Yup.mixed, "enum", enums);

export default Yup;
