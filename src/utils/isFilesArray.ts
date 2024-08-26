import { isFile } from "./isFile";

export const isFilesArray = (val: unknown) => {
  if (
    !val ||
    typeof val !== "object" ||
    !Object.getPrototypeOf(val)[Symbol.iterator]
  )
    return false;
  else
    // @ts-expect-error TS is not sure about "iterator" being part of val, but we've checked it in first if already
    return [...val].every(
      (i) => i instanceof File || i instanceof Blob || isFile(i)
    );
};
