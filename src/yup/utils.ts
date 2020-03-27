import get from "lodash/get";
import head from "lodash/head";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import transform from "lodash/transform";
import { JSONSchema7 } from "json-schema";

export type Obj = { [key: string]: {} };

/** Retrieves the first item in an object */

export const getObjectHead = <T>(obj: T): false | [string, T[keyof T]] => {
  /** Get all keys from obj */
  const arr = Object.keys(obj);
  /** Grab the first key */
  const key = head(arr);
  if (!isString(key)) {
    return false;
  }
  /** Grab the first item */
  const value = get(obj, key);
  return [key, value];
};

/** Recursively removes any empty objects */

export const removeEmptyObjects = (el: JSONSchema7) => {
  const cleaner = (result: JSONSchema7, value: any, key: string) => {
    var isCollection = isPlainObject(value);
    var cleaned = isCollection ? cleanObject(value) : value;
    if (isCollection && isEmpty(cleaned)) {
      return;
    }
    isArray(result) ? result.push(cleaned) : (result[key] = cleaned);
  };
  const cleanObject = (el: JSONSchema7) => transform(el, cleaner);
  return isPlainObject(el) ? cleanObject(el) : el;
};
