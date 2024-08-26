import * as z from "zod";
import { zfd } from "zod-form-data";

function zNumber(options?: {
  required: true;
  min?: number;
  max?: number;
}): z.ZodEffects<
  z.ZodEffects<z.ZodEffects<z.ZodNumber, number, number>, number, number>,
  number,
  number
>;
function zNumber(options?: {
  required?: Boolean;
  min?: number;
  max?: number;
}): z.ZodUnion<
  [
    z.ZodEffects<
      z.ZodEffects<z.ZodEffects<z.ZodNumber, number, number>, number, number>,
      number,
      number
    >,
    z.ZodEffects<z.ZodLiteral<"">, undefined, "">,
    z.ZodUndefined
  ]
>;
function zNumber(options?: {
  required?: Boolean;
  min?: number;
  max?: number;
}):
  | z.ZodEffects<
      z.ZodEffects<z.ZodEffects<z.ZodNumber, number, number>, number, number>,
      number,
      number
    >
  | z.ZodUnion<
      [
        z.ZodEffects<
          z.ZodEffects<
            z.ZodEffects<z.ZodNumber, number, number>,
            number,
            number
          >,
          number,
          number
        >,
        z.ZodEffects<z.ZodLiteral<"">, undefined, "">,
        z.ZodUndefined
      ]
    > {
  if (options && options.required)
    return zfd.numeric(
      z
        .number({ required_error: `required`, invalid_type_error: `required` })
        .refine(
          (val) =>
            !options ||
            typeof options.min === "undefined" ||
            val >= options.min,
          options?.min ? `tooSmall|min=${options.min}` : ""
        )
        .refine(
          (val) =>
            !options ||
            typeof options.max === "undefined" ||
            val <= options.max,
          options?.max ? `tooBig|max=${options.max}` : ""
        )
    );
  else
    return z.union([
      zfd.numeric(
        z
          .number({
            required_error: `required`,
            invalid_type_error: `required`,
          })
          .refine(
            (val) =>
              !options ||
              typeof options.min === "undefined" ||
              val >= options.min,
            options?.min ? `tooSmall|min=${options.min}` : ""
          )
          .refine(
            (val) =>
              !options ||
              typeof options.max === "undefined" ||
              val <= options.max,
            options?.max ? `tooBig|max=${options.max}` : ""
          )
      ),
      z.literal("").transform((val) => undefined),
      z.undefined({ message: "invalid" }),
    ]);
}

export { zNumber };
