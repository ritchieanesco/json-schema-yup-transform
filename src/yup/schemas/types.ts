import has from "lodash/has";
import Yup from "../addMethods";

/**
 * Interface adhers to Yup when schema builder options
 */

export interface Builder {
  is: (val: unknown) => boolean;
  then: Yup.Lazy | Yup.MixedSchema<any>;
  otherwise?: Yup.Lazy | Yup.MixedSchema<any>;
}

/**
 * Determine if an object is a yup when schema builder object
 */

export const isBuilder = (builder: Builder | {}): builder is Builder =>
  has(builder, "is") && has(builder, "then");
