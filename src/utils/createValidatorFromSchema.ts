import { z } from "zod";
import type { AnyFormFieldsSchema, SchemaToZodObj } from "./types";

export const createValidatorFromSchema = <Schema extends AnyFormFieldsSchema>(
  schema: Schema,
  values: object
): SchemaToZodObj<Schema> => {
  return z.object(
    Object.entries(schema).reduce((acc, [key, value]) => {
      if (
        !value.conditioned ||
        (value.conditioned && value.conditioned(values))
      )
        acc[key] = value.conditioned
          ? value.validation.or(z.undefined())
          : value.validation;

      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  ) as SchemaToZodObj<typeof schema>;
};
