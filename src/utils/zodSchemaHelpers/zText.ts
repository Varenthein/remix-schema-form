import * as z from "zod";

export const zText = (options?: { min?: number; max?: number }) =>
  z
    .string({ message: "invalid" })
    .refine(
      (val) =>
        !options ||
        typeof options.min === "undefined" ||
        val.length >= options.min,
      options?.min ? `tooShort|min=${options.min}` : ""
    )
    .refine(
      (val) =>
        !options ||
        typeof options.max === "undefined" ||
        val.length <= options.max,
      options?.max ? `tooLong|max=${options.max}` : ""
    );
