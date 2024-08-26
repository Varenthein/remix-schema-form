import * as z from "zod";
import { AnyFormFieldsSchema, FieldAdditionalValidators } from "./types";

export const runAdditionalZodValidations = <T extends string>(
  schema: AnyFormFieldsSchema,
  data: Record<string, any>,
  ctx: z.RefinementCtx,
  validators: FieldAdditionalValidators<T>
) => {
  for (const fieldName in schema) {
    const fieldSchema = schema[fieldName]!;

    if (fieldSchema.type in validators) {
      const fieldTypeValidator =
        validators[fieldSchema.type as keyof typeof validators];
      const validationResult = fieldTypeValidator
        ? fieldTypeValidator({
            schema,
            data,
            fieldName,
            options: fieldSchema.options,
            value: data[fieldName],
          })
        : null;

      if (validationResult)
        validationResult.path.forEach((p) =>
          ctx.addIssue({
            code: "custom",
            message: validationResult.message,
            path: [p],
          })
        );
    }
  }
};
