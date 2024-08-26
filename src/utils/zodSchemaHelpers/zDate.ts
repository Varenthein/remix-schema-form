import { z } from "zod";

function zDate(options: {
  required: true;
  minDate?: Date;
  maxDate?: Date;
}): z.ZodPipeline<
  z.ZodEffects<z.ZodString, Date, string>,
  z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>
>;
function zDate(options?: {
  required?: Boolean;
  minDate?: Date;
  maxDate?: Date;
}): z.ZodUnion<
  [
    z.ZodUndefined,
    z.ZodPipeline<
      z.ZodEffects<z.ZodString, Date | undefined, string>,
      z.ZodUnion<
        [
          z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>,
          z.ZodUndefined
        ]
      >
    >
  ]
>;
function zDate(options?: {
  required?: Boolean;
  minDate?: Date;
  maxDate?: Date;
}):
  | z.ZodUnion<
      [
        z.ZodUndefined,
        z.ZodPipeline<
          z.ZodEffects<z.ZodString, Date | undefined, string>,
          z.ZodUnion<
            [
              z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>,
              z.ZodUndefined
            ]
          >
        >
      ]
    >
  | z.ZodPipeline<
      z.ZodEffects<z.ZodString, Date, string>,
      z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>
    > {
  if (options && options.required) {
    return z
      .string({ message: "required" })
      .transform((val) => new Date(val))
      .pipe(
        z
          .date({ message: "invalid" })
          .refine(
            (val) =>
              !options ||
              typeof options.minDate === "undefined" ||
              new Date(val) >= options.minDate,
            {
              message: options?.minDate
                ? `dateTooEarly|min=${options.minDate.toLocaleDateString()}`
                : "",
            }
          )
          .refine(
            (val) =>
              !options ||
              typeof options.maxDate === "undefined" ||
              new Date(val) <= options.maxDate,
            {
              message: options?.maxDate
                ? `dateTooLate|max=${options.maxDate.toLocaleDateString()}`
                : "",
            }
          )
      );
  } else {
    return z.undefined({ message: "invalid" }).or(
      z
        .string({ message: "invalid" })
        .transform((val) => {
          const parsedVal = new Date(val);
          return parsedVal instanceof Date && !isNaN(parsedVal.getTime())
            ? parsedVal
            : undefined;
        })
        .pipe(
          z
            .date({ message: "invalid" })
            .refine(
              (val) =>
                !options ||
                typeof options.minDate === "undefined" ||
                new Date(val) >= options.minDate,
              {
                message: options?.minDate
                  ? `dateTooEarly|min=${options.minDate.toLocaleDateString()}`
                  : "",
              }
            )
            .refine(
              (val) =>
                !options ||
                typeof options.maxDate === "undefined" ||
                new Date(val) <= options.maxDate,
              {
                message: options?.maxDate
                  ? `dateTooLate|max=${options.maxDate.toLocaleDateString()}`
                  : "",
              }
            )
            .or(z.undefined({ message: "invalid" }))
        )
    );
  }
}

export { zDate };
