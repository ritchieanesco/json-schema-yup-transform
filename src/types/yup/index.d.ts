import {
  NumberSchema,
  StringSchema,
  ArraySchema,
  BooleanSchema,
  TestOptionsMessage
} from "yup";
import { JSONSchema7Definition, JSONSchema7Type } from "json-schema";

declare module "yup" {
  interface NumberSchema {
    multipleOf(value: number, message?: string): this;
    constant(value: JSONSchema7Type, message?: string): this;
    enum(value: JSONSchema7Type[], message?: string): this;
  }
  interface StringSchema {
    urlReference(message?: string): this;
    constant(value: JSONSchema7Type, message?: string): this;
    enum(value: JSONSchema7Type[], message?: string): this;
  }
  interface BooleanSchema {
    constant(value: JSONSchema7Type, message?: string): this;
  }
  interface ArraySchema<T> {
    list(type: string, message: string): this;
    contains(type: string, message: string): this;
    tuple(items: JSONSchema7Definition[], message: string): this;
    minimumItems(count: number, message: string): this;
    maximumItems(count: number, message: string): this;
    constant(value: JSONSchema7Type, message?: string): this;
    enum(value: JSONSchema7Type[], message?: string): this;
  }

  interface Schema<T> {
    required(message: TestOptionsMessage): this;
  }
}
