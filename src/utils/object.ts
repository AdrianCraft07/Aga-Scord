import { WagaResponse } from "waga/dist/types";
import { InternalError } from "./internalErrors";

export function deleteKeys<O, T extends string>(obj: O, keys: T[]): Omit<O, T> {
	const newObj = JSON.parse(JSON.stringify(obj));
	for (const key of keys) delete newObj[key];
	return newObj;
}

export function makeError(res: WagaResponse, status: number, error: InternalError) {
  res.status(status);
  return error;
}