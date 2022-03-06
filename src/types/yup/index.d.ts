import {
  NumberSchema,
  StringSchema,
  ArraySchema,
  BooleanSchema,
  TestOptionsMessage
} from "yup";
import type { JSONSchemaDefinition, JSONSchemaType } from "../../schema/"

declare module "yup" {
  interface NumberSchema {
    multipleOf(value: number, message?: string): this;
  }
  interface StringSchema {
    urlReference(message?: string): this;
  }

  interface ArraySchema<T> {
    list(type: string, message: string): this;
    contains(type: string, message: string): this;
    tuple(items: JSONSchemaDefinition[], message: string): this;
    minimumItems(count: number, message: string): this;
    maximumItems(count: number, message: string): this;
    uniqueItems(enable: boolean, message?: string): this;
  }

  interface Schema<T> {
    required(message: TestOptionsMessage): this;
    constant(value: JSONSchemaType, message?: string): this;
    enum(value: JSONSchemaType[], message?: string): this;
  }
}
